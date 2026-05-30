from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    email_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(200), nullable=True)
    reset_token = db.Column(db.String(200), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    @property
    def password(self): raise AttributeError('Password is not readable')
    @password.setter
    def password(self, plain_password): self.password_hash = bcrypt.generate_password_hash(plain_password).decode('utf-8')
    def verify_password(self, plain_password): return bcrypt.check_password_hash(self.password_hash, plain_password)
    def to_dict(self): return {'id': self.id, 'name': self.name, 'email': self.email, 'email_verified': self.email_verified}

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan')
    def to_dict(self): return {'id': self.id, 'title': self.title, 'description': self.description, 'image_url': self.image_url, 'modules_count': len(self.modules)}

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade='all, delete-orphan')
    def to_dict(self): return {'id': self.id, 'course_id': self.course_id, 'title': self.title, 'order': self.order, 'lessons_count': len(self.lessons)}

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String(200), nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    order = db.Column(db.Integer, nullable=False)
    def to_dict(self): return {'id': self.id, 'module_id': self.module_id, 'title': self.title, 'content': self.content, 'video_url': self.video_url, 'duration': self.duration, 'order': self.order}

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(200), nullable=False)
    option_b = db.Column(db.String(200), nullable=False)
    option_c = db.Column(db.String(200), nullable=False)
    correct_answer = db.Column(db.String(1), nullable=False)
    course = db.relationship('Course', backref='quizzes')
    lesson = db.relationship('Lesson', backref='quizzes')
    def to_dict(self): return {'id': self.id, 'course_id': self.course_id, 'lesson_id': self.lesson_id, 'question': self.question, 'option_a': self.option_a, 'option_b': self.option_b, 'option_c': self.option_c}
    def check_answer(self, answer): return self.correct_answer.lower() == answer.lower()

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    quiz_score = db.Column(db.Integer, default=0)
    quiz_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    user = db.relationship('User', backref='progress')
    course = db.relationship('Course', backref='progress')
    lesson = db.relationship('Lesson', backref='progress')
    def to_dict(self): return {'id': self.id, 'user_id': self.user_id, 'course_id': self.course_id, 'lesson_id': self.lesson_id, 'quiz_score': self.quiz_score, 'quiz_completed': self.quiz_completed, 'completed_at': self.completed_at.isoformat() if self.completed_at else None}

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(20), default='pending')
    expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user = db.relationship('User', backref='enrollments')
    course = db.relationship('Course', backref='enrollments')
    def to_dict(self): return {'id': self.id, 'user_id': self.user_id, 'course_id': self.course_id, 'course_title': self.course.title, 'payment_method': self.payment_method, 'payment_status': self.payment_status, 'created_at': self.created_at.isoformat() if self.created_at else None, 'expires_at': self.expires_at.isoformat() if self.expires_at else None}

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='USD')
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending')
    transaction_ref = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user = db.relationship('User', backref='transactions')
    course = db.relationship('Course', backref='transactions')
    def to_dict(self): return {'id': self.id, 'user_id': self.user_id, 'course_id': self.course_id, 'course_title': self.course.title, 'amount': self.amount, 'currency': self.currency, 'payment_method': self.payment_method, 'status': self.status, 'transaction_ref': self.transaction_ref, 'created_at': self.created_at.isoformat() if self.created_at else None}
