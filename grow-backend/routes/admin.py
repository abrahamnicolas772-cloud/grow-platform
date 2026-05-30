from flask import Blueprint, request, jsonify, session
from models import db, Course, Module, Lesson, Quiz, User

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == 'admin' and password == 'admin123':
        session['admin_id'] = 1
        session['is_admin'] = True
        return jsonify({'success': True, 'message': 'Admin logged in'}), 200
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@bp.route('/check', methods=['GET'])
def check_admin():
    if session.get('is_admin'): return jsonify({'is_admin': True}), 200
    return jsonify({'is_admin': False}), 200

@bp.route('/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_id', None)
    session.pop('is_admin', None)
    return jsonify({'success': True}), 200

@bp.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([{'id': c.id, 'title': c.title, 'description': c.description, 'image_url': c.image_url, 'modules_count': len(c.modules)} for c in courses]), 200

@bp.route('/courses', methods=['POST'])
def create_course():
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    course = Course(title=data['title'], description=data.get('description', ''), image_url=data.get('image_url', ''))
    db.session.add(course)
    db.session.commit()
    return jsonify({'id': course.id, 'message': 'Course created'}), 201

@bp.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    course.title = data.get('title', course.title)
    course.description = data.get('description', course.description)
    course.image_url = data.get('image_url', course.image_url)
    db.session.commit()
    return jsonify({'message': 'Course updated'}), 200

@bp.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({'message': 'Course deleted'}), 200

@bp.route('/courses/<int:course_id>/modules', methods=['POST'])
def add_module(course_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    existing = Module.query.filter_by(course_id=course_id).count()
    module = Module(course_id=course_id, title=data['title'], order=existing + 1)
    db.session.add(module)
    db.session.commit()
    return jsonify({'id': module.id, 'message': 'Module added'}), 201

@bp.route('/modules/<int:module_id>', methods=['PUT'])
def update_module(module_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    module = Module.query.get_or_404(module_id)
    data = request.get_json()
    module.title = data.get('title', module.title)
    module.order = data.get('order', module.order)
    db.session.commit()
    return jsonify({'message': 'Module updated'}), 200

@bp.route('/modules/<int:module_id>', methods=['DELETE'])
def delete_module(module_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    module = Module.query.get_or_404(module_id)
    db.session.delete(module)
    db.session.commit()
    return jsonify({'message': 'Module deleted'}), 200

@bp.route('/modules', methods=['GET'])
def get_modules():
    modules = Module.query.all()
    return jsonify([{'id': m.id, 'title': m.title, 'course_id': m.course_id, 'order': m.order} for m in modules]), 200

@bp.route('/modules/<int:module_id>/lessons', methods=['POST'])
def add_lesson(module_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    existing = Lesson.query.filter_by(module_id=module_id).count()
    lesson = Lesson(module_id=module_id, title=data['title'], content=data.get('content', ''), video_url=data.get('video_url', ''), duration=data.get('duration', 15), order=existing + 1)
    db.session.add(lesson)
    db.session.commit()
    return jsonify({'id': lesson.id, 'message': 'Lesson added'}), 201

@bp.route('/lessons/<int:lesson_id>', methods=['PUT'])
def update_lesson(lesson_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    lesson = Lesson.query.get_or_404(lesson_id)
    data = request.get_json()
    lesson.title = data.get('title', lesson.title)
    lesson.content = data.get('content', lesson.content)
    lesson.video_url = data.get('video_url', lesson.video_url)
    lesson.duration = data.get('duration', lesson.duration)
    db.session.commit()
    return jsonify({'message': 'Lesson updated'}), 200

@bp.route('/lessons/<int:lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    lesson = Lesson.query.get_or_404(lesson_id)
    db.session.delete(lesson)
    db.session.commit()
    return jsonify({'message': 'Lesson deleted'}), 200

@bp.route('/lessons', methods=['GET'])
def get_lessons():
    lessons = Lesson.query.all()
    return jsonify([{'id': l.id, 'title': l.title, 'module_id': l.module_id, 'duration': l.duration, 'order': l.order} for l in lessons]), 200

@bp.route('/lessons/<int:lesson_id>/quiz', methods=['POST'])
def add_quiz(lesson_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    existing = Quiz.query.filter_by(lesson_id=lesson_id).first()
    if existing: return jsonify({'error': 'Quiz already exists'}), 400
    quiz = Quiz(course_id=data['course_id'], lesson_id=lesson_id, question=data['question'], option_a=data['option_a'], option_b=data['option_b'], option_c=data.get('option_c', ''), correct_answer=data['correct_answer'])
    db.session.add(quiz)
    db.session.commit()
    return jsonify({'id': quiz.id, 'message': 'Quiz added'}), 201

@bp.route('/quiz/<int:quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    quiz = Quiz.query.get_or_404(quiz_id)
    data = request.get_json()
    quiz.question = data.get('question', quiz.question)
    quiz.option_a = data.get('option_a', quiz.option_a)
    quiz.option_b = data.get('option_b', quiz.option_b)
    quiz.option_c = data.get('option_c', quiz.option_c)
    quiz.correct_answer = data.get('correct_answer', quiz.correct_answer)
    db.session.commit()
    return jsonify({'message': 'Quiz updated'}), 200

@bp.route('/quiz/<int:quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    quiz = Quiz.query.get_or_404(quiz_id)
    db.session.delete(quiz)
    db.session.commit()
    return jsonify({'message': 'Quiz deleted'}), 200

@bp.route('/quizzes', methods=['GET'])
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([{'id': q.id, 'question': q.question, 'lesson_id': q.lesson_id, 'course_id': q.course_id} for q in quizzes]), 200

@bp.route('/stats', methods=['GET'])
def get_stats():
    if not session.get('is_admin'): return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'total_courses': Course.query.count(), 'total_modules': Module.query.count(), 'total_lessons': Lesson.query.count(), 'total_quizzes': Quiz.query.count(), 'total_users': User.query.count()}), 200
