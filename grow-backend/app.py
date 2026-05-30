from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from models import db, bcrypt, User, Course, Module, Lesson, Quiz, UserProgress, Enrollment, Transaction
from datetime import datetime, timedelta
import os, uuid
from dotenv import load_dotenv
from emails import send_verification_email, send_password_reset_email
from routes.admin import bp as admin_bp

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'grow-secret-key-2025')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///grow.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuration pour éviter les erreurs de connexion SSL (Neon)
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300
}

CORS(app, supports_credentials=True, origins='*', allow_headers=['Content-Type'])

db.init_app(app)
bcrypt.init_app(app)
app.register_blueprint(admin_bp)

# ========== AUTH ==========
@app.route('/api/register', methods=['POST','OPTIONS'])
def register():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    if not data.get('name') or not data.get('email') or not data.get('password'): return jsonify({'error':'All fields required'}), 400
    if User.query.filter_by(email=data['email']).first(): return jsonify({'error':'Email already used'}), 400
    token = str(uuid.uuid4())
    user = User(name=data['name'], email=data['email'], verification_token=token)
    user.password = data['password']
    # Le compte n'est PAS activé automatiquement – email de vérification requis
    db.session.add(user); db.session.commit()
    send_verification_email(user.email, user.name, token)
    return jsonify({'message':'Registered! Check your email.','user':user.to_dict()}), 201

@app.route('/api/verify-email', methods=['POST','OPTIONS'])
def verify_email():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    user = User.query.filter_by(verification_token=data['token']).first()
    if not user: return jsonify({'error':'Invalid token'}), 400
    user.email_verified = True; user.verification_token = None
    db.session.commit()
    return jsonify({'message':'Email verified!'}), 200

@app.route('/api/login', methods=['POST','OPTIONS'])
def login():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.verify_password(data['password']): return jsonify({'error':'Invalid credentials'}), 401
    # Vérification de l'email (sauf pour l'admin)
    if user.email != 'admin@grow.com' and not user.email_verified:
        return jsonify({'error':'Please verify your email before logging in.'}), 403
    # Auto-inscription admin
    if user.email == 'admin@grow.com':
        for c in Course.query.all():
            if not Enrollment.query.filter_by(user_id=user.id, course_id=c.id).first():
                db.session.add(Enrollment(user_id=user.id, course_id=c.id, payment_method='admin', payment_status='completed'))
        db.session.commit()
    return jsonify({'message':'Connected','user':user.to_dict()}), 200

@app.route('/api/forgot-password', methods=['POST','OPTIONS'])
def forgot_password():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user: return jsonify({'message':'If email exists, link sent.'}), 200
    token = str(uuid.uuid4()); user.reset_token = token; user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()
    send_password_reset_email(user.email, user.name, token)
    return jsonify({'message':'Reset email sent!'}), 200

@app.route('/api/reset-password', methods=['POST','OPTIONS'])
def reset_password():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    user = User.query.filter_by(reset_token=data['token']).first()
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow(): return jsonify({'error':'Invalid token'}), 400
    user.password = data['password']; user.reset_token = None; user.reset_token_expires = None
    db.session.commit()
    return jsonify({'message':'Password reset!'}), 200

@app.route('/api/users', methods=['GET'])
def get_users(): return jsonify([u.to_dict() for u in User.query.all()]), 200

# ========== COURSES ==========
@app.route('/api/courses', methods=['GET'])
def get_courses(): return jsonify([c.to_dict() for c in Course.query.all()]), 200

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id): return jsonify(Course.query.get_or_404(course_id).to_dict()), 200

@app.route('/api/courses/<int:course_id>/modules', methods=['GET'])
def get_course_modules(course_id):
    course = Course.query.get_or_404(course_id)
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order).all()
    result = []
    for m in modules:
        lessons = Lesson.query.filter_by(module_id=m.id).order_by(Lesson.order).all()
        result.append({
            'id': m.id,
            'title': m.title,
            'order': m.order,
            'lessons': [l.to_dict() for l in lessons]
        })
    return jsonify(result), 200

@app.route('/api/courses/modules/<int:module_id>/lessons', methods=['GET'])
def get_module_lessons(module_id): return jsonify([l.to_dict() for l in Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()]), 200

# ========== CHECKOUT ==========
@app.route('/api/checkout-info/<int:item_id>', methods=['GET'])
def checkout_info(item_id):
    if item_id == 99: return jsonify({'title':'Flow Plan','description':'All courses 1 month','price':49,'price_htg':6615,'type':'plan','duration':'1 month'}), 200
    course = Course.query.get(item_id)
    if course: return jsonify({'title':course.title,'description':course.description,'price':29,'price_htg':3915,'type':'course','duration':'Lifetime','image_url':course.image_url,'modules_count':len(course.modules)}), 200
    return jsonify({'error':'Not found'}), 404

@app.route('/api/enroll', methods=['POST','OPTIONS'])
def enroll():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    if not data.get('user_id') or not data.get('course_id'): return jsonify({'error':'user_id and course_id required'}), 400
    if Enrollment.query.filter_by(user_id=data['user_id'], course_id=data['course_id'], payment_status='completed').first(): return jsonify({'error':'Already enrolled'}), 400
    e = Enrollment(user_id=data['user_id'], course_id=data['course_id'], payment_method=data.get('payment_method','card'), payment_status='completed')
    db.session.add(e); db.session.commit()
    return jsonify(e.to_dict()), 201

@app.route('/api/mycourses', methods=['GET'])
def my_courses():
    user_id = request.args.get('user_id')
    result = []
    for e in Enrollment.query.filter_by(user_id=user_id, payment_status='completed').all():
        c = Course.query.get(e.course_id)
        if c:
            d = c.to_dict(); d['enrollment_id'] = e.id; d['course_title'] = c.title
            result.append(d)
    return jsonify(result), 200

@app.route('/api/checkout', methods=['POST','OPTIONS'])
def checkout():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    if not data.get('user_id') or not data.get('course_id'): return jsonify({'error':'user_id and course_id required'}), 400
    if Enrollment.query.filter_by(user_id=data['user_id'], course_id=data['course_id'], payment_status='completed').first(): return jsonify({'error':'Already enrolled'}), 400
    expires_at = datetime.utcnow() + timedelta(days=30) if data.get('course_id') == 99 else None
    ref = str(uuid.uuid4())[:12]
    t = Transaction(user_id=data['user_id'], course_id=data['course_id'], amount=data.get('amount',29), payment_method=data.get('payment_method','card'), status='completed', transaction_ref=ref)
    db.session.add(t)
    e = Enrollment(user_id=data['user_id'], course_id=data['course_id'], payment_method=data.get('payment_method','card'), payment_status='completed', expires_at=expires_at)
    db.session.add(e); db.session.commit()
    return jsonify({'message':'Payment successful!','transaction':t.to_dict(),'enrollment':e.to_dict()}), 201

@app.route('/api/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id): return jsonify([t.to_dict() for t in Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).all()]), 200

# ========== QUIZ ==========
@app.route('/api/quiz', methods=['GET'])
def get_quiz(): return jsonify([q.to_dict() for q in Quiz.query.filter_by(lesson_id=request.args.get('lesson_id')).all()]), 200

@app.route('/api/quiz/submit', methods=['POST','OPTIONS'])
def submit_quiz():
    if request.method == 'OPTIONS': return jsonify({}), 200
    data = request.get_json()
    quiz = Quiz.query.filter_by(lesson_id=data['lesson_id']).first()
    if not quiz: return jsonify({'error':'Quiz not found'}), 404
    is_correct = quiz.check_answer(data['answer'])
    db.session.add(UserProgress(user_id=data['user_id'], course_id=quiz.course_id, lesson_id=data['lesson_id'], quiz_score=1 if is_correct else 0, quiz_completed=True, completed_at=datetime.utcnow()))
    db.session.commit()
    return jsonify({'correct':is_correct,'score':1 if is_correct else 0}), 200

@app.route('/api/quiz/progress/<int:user_id>/<int:course_id>', methods=['GET'])
def get_progress(user_id, course_id): return jsonify([p.to_dict() for p in UserProgress.query.filter_by(user_id=user_id, course_id=course_id).all()]), 200

with app.app_context(): db.create_all()
if __name__ == '__main__': app.run(debug=True, port=5000)