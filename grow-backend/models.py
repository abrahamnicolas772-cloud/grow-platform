from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100))
    reset_token = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_admin': self.is_admin,
            'email_verified': self.email_verified
        }

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, default=0)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'modules_count': len(self.modules)
        }

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    order = db.Column(db.Integer, default=0)
    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'order': self.order,
            'lessons': [lesson.to_dict() for lesson in self.lessons]
        }

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    order = db.Column(db.Integer, default=0)
    duration = db.Column(db.Integer, default=0)  # minutes

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'order': self.order,
            'duration': self.duration
        }

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False, unique=True)
    type = db.Column(db.String(20), default='qcm')  # 'qcm' or 'code'
    question = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(500))
    option_b = db.Column(db.String(500))
    option_c = db.Column(db.String(500))
    correct_answer = db.Column(db.String(10))
    starter_code = db.Column(db.Text)
    expected_test = db.Column(db.String(500))
    lesson = db.relationship('Lesson', backref=db.backref('quiz', uselist=False))

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_lessons = db.Column(db.Integer, default=0)
    certificate_issued = db.Column(db.Boolean, default=False)
    user = db.relationship('User', backref='enrollments')
    course = db.relationship('Course', backref='enrollments')

class Assignment(db.Model):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    code = db.Column(db.Text)
    file_name = db.Column(db.String(255))
    file_url = db.Column(db.String(500))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    grade = db.Column(db.Integer)
    feedback = db.Column(db.Text)

    user = db.relationship('User', backref='assignments')
    module = db.relationship('Module', backref='assignments')