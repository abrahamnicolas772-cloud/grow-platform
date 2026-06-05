from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///grow.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ========== MODÈLES ==========
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'is_admin': self.is_admin}

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    video_intro = db.Column(db.String(500))
    price = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'image_url': self.image_url, 'video_intro': self.video_intro, 'price': self.price
        }

class Module(db.Model):
    __tablename__ = 'module'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    order = db.Column(db.Integer, default=0)
    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade='all, delete-orphan')
    quiz = db.relationship('Quiz', backref='module', uselist=False, cascade='all, delete-orphan')
    assignment = db.relationship('Assignment', backref='module', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'description': self.description,
            'order': self.order, 'lessons': [l.to_dict() for l in self.lessons]
        }

class Lesson(db.Model):
    __tablename__ = 'lesson'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    duration = db.Column(db.Integer, default=15)
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id, 'title': self.title, 'content': self.content,
            'video_url': self.video_url, 'image_url': self.image_url,
            'duration': self.duration, 'order': self.order
        }

class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    questions = db.Column(db.Text)  # Stocké en JSON
    passing_score = db.Column(db.Integer, default=70)

class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempt'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    score = db.Column(db.Integer)
    passed = db.Column(db.Boolean, default=False)
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

class Assignment(db.Model):
    __tablename__ = 'assignment'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    instructions = db.Column(db.Text)
    deadline = db.Column(db.DateTime)

class AssignmentSubmission(db.Model):
    __tablename__ = 'assignment_submission'
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_url = db.Column(db.String(500))
    text_answer = db.Column(db.Text)
    grade = db.Column(db.Float, default=0)
    feedback = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Certificate(db.Model):
    __tablename__ = 'certificate'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_id = db.Column(db.String(100), unique=True)

# ========== ROUTES API ==========
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses])

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify(course.to_dict())

@app.route('/api/courses/<int:course_id>/modules', methods=['GET'])
def get_course_modules(course_id):
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order).all()
    return jsonify([m.to_dict() for m in modules])

@app.route('/api/modules/<int:module_id>/lessons', methods=['GET'])
def get_module_lessons(module_id):
    lessons = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()
    return jsonify([l.to_dict() for l in lessons])

@app.route('/api/modules/<int:module_id>/quiz', methods=['GET'])
def get_module_quiz(module_id):
    quiz = Quiz.query.filter_by(module_id=module_id).first()
    if quiz:
        return jsonify({
            'id': quiz.id,
            'questions': json.loads(quiz.questions),
            'passing_score': quiz.passing_score
        })
    return jsonify({'error': 'No quiz for this module'}), 404

@app.route('/api/modules/<int:module_id>/quiz/submit', methods=['POST'])
def submit_quiz(module_id):
    data = request.get_json()
    user_id = data.get('user_id')
    answers = data.get('answers')
    
    quiz = Quiz.query.filter_by(module_id=module_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    questions = json.loads(quiz.questions)
    score = 0
    for i, q in enumerate(questions):
        if answers.get(str(i)) == q['correct']:
            score += 100 // len(questions)
    
    passed = score >= quiz.passing_score
    
    attempt = QuizAttempt(
        user_id=user_id,
        module_id=module_id,
        score=score,
        passed=passed
    )
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify({'score': score, 'passed': passed, 'passing_score': quiz.passing_score})

@app.route('/api/modules/<int:module_id>/assignment', methods=['GET'])
def get_assignment(module_id):
    assignment = Assignment.query.filter_by(module_id=module_id).first()
    if assignment:
        return jsonify({
            'id': assignment.id,
            'title': assignment.title,
            'description': assignment.description,
            'instructions': assignment.instructions,
            'deadline': assignment.deadline
        })
    return jsonify({'error': 'No assignment for this module'}), 404

@app.route('/api/assignments/submit', methods=['POST'])
def submit_assignment():
    data = request.get_json()
    submission = AssignmentSubmission(
        assignment_id=data['assignment_id'],
        user_id=data['user_id'],
        text_answer=data.get('text_answer'),
        file_url=data.get('file_url'),
        status='submitted'
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Assignment submitted', 'submission_id': submission.id})

@app.route('/api/certificate/<int:course_id>/<int:user_id>', methods=['GET'])
def get_certificate(course_id, user_id):
    # Vérifier si tous les modules sont complétés
    modules = Module.query.filter_by(course_id=course_id).all()
    all_completed = True
    for module in modules:
        quiz_passed = QuizAttempt.query.filter_by(
            user_id=user_id, module_id=module.id, passed=True
        ).first()
        if not quiz_passed:
            all_completed = False
            break
    
    if not all_completed:
        return jsonify({'error': 'Complete all modules first'}), 400
    
    cert = Certificate.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not cert:
        cert = Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_id=f"CERT-{user_id}-{course_id}-{int(datetime.utcnow().timestamp())}"
        )
        db.session.add(cert)
        db.session.commit()
    
    return jsonify({
        'certificate_id': cert.certificate_id,
        'issued_at': cert.issued_at,
        'message': 'Certificate generated!'
    })

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(name=data['name'], email=data['email'], email_verified=True)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'user': user.to_dict()})

# Initialisation
with app.app_context():
    db.create_all()
    print("✅ Base de données initialisée")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
