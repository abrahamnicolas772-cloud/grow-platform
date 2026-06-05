from flask import Blueprint, request, jsonify
from models import db, Course, Module, Lesson, Enrollment, User

# Changement : bp -> courses_bp
courses_bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@courses_bp.route('', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses])

@courses_bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order).all()
    
    result = course.to_dict()
    result['modules'] = [module.to_dict() for module in modules]
    
    return jsonify(result)

@courses_bp.route('/modules/<int:module_id>/lessons', methods=['GET'])
def get_module_lessons(module_id):
    lessons = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()
    return jsonify([lesson.to_dict() for lesson in lessons])

@courses_bp.route('/<int:course_id>/enroll', methods=['POST'])
def enroll_course(course_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "user_id requis"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Cours non trouvé"}), 404
    
    existing = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        return jsonify({"error": "Déjà inscrit à ce cours"}), 400
    
    total_lessons = db.session.query(Lesson)\
        .join(Module)\
        .filter(Module.course_id == course_id)\
        .count()
    
    enrollment = Enrollment(
        user_id=user_id,
        course_id=course_id,
        total_lessons=total_lessons
    )
    
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify(enrollment.to_dict()), 201

@courses_bp.route('/progress/<int:enrollment_id>', methods=['PUT'])
def update_progress(enrollment_id):
    data = request.get_json()
    completed_lessons = data.get('completed_lessons')
    
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    enrollment.completed_lessons = completed_lessons
    
    db.session.commit()
    
    return jsonify(enrollment.to_dict())

@courses_bp.route('/user/<int:user_id>/enrollments', methods=['GET'])
def get_user_enrollments(user_id):
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    return jsonify([e.to_dict() for e in enrollments])

@courses_bp.route('/seed', methods=['POST'])
def seed_courses():
    if Course.query.count() > 0:
        return jsonify({"message": "Des cours existent déjà"}), 400
    
    # ... (le reste du code de seed est inchangé)
    return jsonify({"message": "Cours de test créés avec succès"}), 201