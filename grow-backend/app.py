from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
import json

app = Flask(__name__)
CORS(app, origins=["https://grow-platform.vercel.app", "http://localhost:3000"])
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

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))

class Module(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'))

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{'id': c.id, 'title': c.title, 'description': c.description, 'image_url': c.image_url} for c in courses])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': {'id': user.id, 'name': user.name, 'email': user.email}}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'user': {'id': user.id, 'name': user.name, 'email': user.email, 'is_admin': user.is_admin}})

with app.app_context():
    db.create_all()
    if not User.query.filter_by(email='admin@grow.com').first():
        admin = User(name='Admin', email='admin@grow.com', is_admin=True)
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin créé: admin@grow.com / admin123")
    if Course.query.count() == 0:
        course = Course(title='React Moderne 2025', description='Apprenez React', image_url='https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg')
        db.session.add(course)
        db.session.commit()
        m1 = Module(title='Module 1', course_id=course.id)
        db.session.add(m1)
        db.session.commit()
        Lesson(title='Introduction', content='<h2>React</h2><p>Bibliothèque JavaScript</p>', module_id=m1.id)
        Lesson(title='Composants', content='<h2>Composants</h2><p>Fonctions qui retournent du JSX</p>', module_id=m1.id)
        db.session.commit()
        print("✅ Cours créé")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
