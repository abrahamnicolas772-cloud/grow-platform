from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'is_admin': self.is_admin}

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'title': self.title, 'description': self.description, 'image_url': self.image_url}

class Module(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {'id': self.id, 'title': self.title, 'order': self.order}

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {'id': self.id, 'title': self.title, 'content': self.content, 'order': self.order}

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress = db.Column(db.Integer, default=0)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    questions = db.Column(db.Text)
    passing_score = db.Column(db.Integer, default=70)

    def to_dict(self):
        return {'id': self.id, 'questions': json.loads(self.questions) if self.questions else [], 'passing_score': self.passing_score}

class QuizAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    score = db.Column(db.Integer, default=0)
    passed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_number = db.Column(db.String(100), unique=True)

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
    result = []
    for m in modules:
        lessons = Lesson.query.filter_by(module_id=m.id).order_by(Lesson.order).all()
        result.append({
            'id': m.id,
            'title': m.title,
            'order': m.order,
            'lessons': [l.to_dict() for l in lessons]
        })
    return jsonify(result)

@app.route('/api/modules/<int:module_id>/lessons', methods=['GET'])
def get_module_lessons(module_id):
    lessons = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()
    return jsonify([l.to_dict() for l in lessons])

@app.route('/api/modules/<int:module_id>/quiz', methods=['GET'])
def get_module_quiz(module_id):
    quiz = Quiz.query.filter_by(module_id=module_id).first()
    if not quiz:
        default_questions = [
            {'question': 'React est une bibliotheque ?', 'options': ['JavaScript', 'Python', 'Java'], 'correct': 'JavaScript'},
            {'question': 'useState sert a ?', 'options': ['Etat', 'Effets', 'Props'], 'correct': 'Etat'}
        ]
        return jsonify({'id': 0, 'questions': default_questions, 'passing_score': 70})
    return jsonify(quiz.to_dict())

@app.route('/api/modules/<int:module_id>/quiz/submit', methods=['POST'])
def submit_quiz(module_id):
    data = request.json
    user_id = data.get('user_id')
    answers = data.get('answers', [])
    
    quiz = Quiz.query.filter_by(module_id=module_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    questions = json.loads(quiz.questions)
    score = 0
    for i, q in enumerate(questions):
        if i < len(answers) and answers[i] == q['correct']:
            score += 100 // len(questions)
    
    passed = score >= quiz.passing_score
    
    attempt = QuizAttempt(user_id=user_id, module_id=module_id, score=score, passed=passed)
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify({'score': score, 'passed': passed, 'passing_score': quiz.passing_score})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'user': user.to_dict()})

@app.route('/api/certificate/<int:course_id>/<int:user_id>', methods=['GET'])
def get_certificate(course_id, user_id):
    modules = Module.query.filter_by(course_id=course_id).all()
    for m in modules:
        if not QuizAttempt.query.filter_by(user_id=user_id, module_id=m.id, passed=True).first():
            return jsonify({'error': 'Complete all quizzes first'}), 400
    
    cert = Certificate.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not cert:
        cert = Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_number=f"CERT-{user_id}-{course_id}-{int(datetime.utcnow().timestamp())}"
        )
        db.session.add(cert)
        db.session.commit()
    
    course = Course.query.get(course_id)
    user = User.query.get(user_id)
    return jsonify({
        'certificate_number': cert.certificate_number,
        'issued_at': cert.issued_at,
        'course_title': course.title if course else '',
        'user_name': user.name if user else ''
    })

with app.app_context():
    db.create_all()
    
    if not User.query.filter_by(email='admin@grow.com').first():
        admin = User(name='Admin', email='admin@grow.com', is_admin=True)
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Admin: admin@grow.com / admin123")
    
    if Course.query.count() == 0:
        course = Course(title='React Moderne 2025', description='Devenez expert React', image_url='https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg')
        db.session.add(course)
        db.session.commit()
        
        m1 = Module(title='Module 1: Fondamentaux', course_id=course.id, order=1)
        db.session.add(m1)
        db.session.commit()
        
        Lesson(title='Introduction', content='<h2>React</h2><p>Bibliotheque JavaScript</p>', module_id=m1.id, order=1)
        Lesson(title='Composants', content='<h2>Composants</h2><p>Fonction qui retourne du JSX</p>', module_id=m1.id, order=2)
        Lesson(title='State', content='<h2>useState</h2><pre>const [count, setCount] = useState(0)</pre>', module_id=m1.id, order=3)
        db.session.commit()
        
        m2 = Module(title='Module 2: Hooks', course_id=course.id, order=2)
        db.session.add(m2)
        db.session.commit()
        
        Lesson(title='useEffect', content='<h2>useEffect</h2><p>Effets de bord</p>', module_id=m2.id, order=1)
        Lesson(title='useContext', content='<h2>useContext</h2><p>State global</p>', module_id=m2.id, order=2)
        db.session.commit()
        
        q1 = [{'question': 'React est une ?', 'options': ['Bibliotheque', 'Framework'], 'correct': 'Bibliotheque'}]
        Quiz(module_id=m1.id, questions=json.dumps(q1), passing_score=70)
        q2 = [{'question': 'useEffect sert a ?', 'options': ['Etat', 'Effets'], 'correct': 'Effets'}]
        Quiz(module_id=m2.id, questions=json.dumps(q2), passing_score=70)
        db.session.commit()
        
        print('Cours et quiz crees')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
