from flask import Blueprint, request, jsonify
from models import db, User, Course, Enrollment

bp = Blueprint('payments', __name__, url_prefix='/api')

# POST /api/enroll - Inscription à un cours
@bp.route('/enroll', methods=['POST'])
def enroll_course():
    data = request.get_json()
    
    user_id = data.get('user_id')
    course_id = data.get('course_id')
    
    if not user_id or not course_id:
        return jsonify({"error": "user_id et course_id requis"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Cours non trouvé"}), 404
    
    existing = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        return jsonify({"error": "Déjà inscrit"}), 400
    
    enrollment = Enrollment(
        user_id=user_id,
        course_id=course_id,
        payment_method='card',
        payment_status='success'
    )
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify({"message": "Inscription réussie"}), 201

# GET /api/mycourses - Récupérer les cours achetés
@bp.route('/mycourses', methods=['GET'])
def get_my_courses():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "user_id requis"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    enrollments = Enrollment.query.filter_by(user_id=user_id, payment_status='success').all()
    courses = []
    for e in enrollments:
        course = Course.query.get(e.course_id)
        if course:
            courses.append({
                "id": e.id,
                "course_id": course.id,
                "course_title": course.title,
                "progress": 0,
                "total_lessons": 0,
                "completed_lessons": 0
            })
    return jsonify(courses)

# GET /api/enrollments - Liste toutes les inscriptions (admin)
@bp.route('/enrollments', methods=['GET'])
def get_all_enrollments():
    enrollments = Enrollment.query.all()
    return jsonify([e.to_dict() for e in enrollments])