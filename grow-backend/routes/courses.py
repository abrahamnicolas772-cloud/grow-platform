from flask import Blueprint, request, jsonify
from models import db, Course, Module, Lesson, Enrollment, User

bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@bp.route('', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses])

@bp.route('/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order).all()
    
    result = course.to_dict()
    result['modules'] = [module.to_dict() for module in modules]
    
    return jsonify(result)

@bp.route('/modules/<int:module_id>/lessons', methods=['GET'])
def get_module_lessons(module_id):
    lessons = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()
    return jsonify([lesson.to_dict() for lesson in lessons])

@bp.route('/<int:course_id>/enroll', methods=['POST'])
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

@bp.route('/progress/<int:enrollment_id>', methods=['PUT'])
def update_progress(enrollment_id):
    data = request.get_json()
    completed_lessons = data.get('completed_lessons')
    
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    enrollment.completed_lessons = completed_lessons
    
    db.session.commit()
    
    return jsonify(enrollment.to_dict())

@bp.route('/user/<int:user_id>/enrollments', methods=['GET'])
def get_user_enrollments(user_id):
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    return jsonify([e.to_dict() for e in enrollments])

@bp.route('/seed', methods=['POST'])
def seed_courses():
    if Course.query.count() > 0:
        return jsonify({"message": "Des cours existent déjà"}), 400
    
    course1 = Course(
        title="Data Analysis",
        description="Apprenez à analyser des données avec Python, pandas et visualisation.",
        image_url="https://via.placeholder.com/300x200?text=Data+Analysis"
    )
    db.session.add(course1)
    db.session.flush()
    
    module1_1 = Module(course_id=course1.id, title="Introduction à l'analyse de données", order=1)
    module1_2 = Module(course_id=course1.id, title="Pandas pour débutants", order=2)
    module1_3 = Module(course_id=course1.id, title="Visualisation avec Matplotlib", order=3)
    
    db.session.add_all([module1_1, module1_2, module1_3])
    db.session.flush()
    
    lesson1_1 = Lesson(module_id=module1_1.id, title="Qu'est-ce que l'analyse de données ?", 
                       content="Introduction à l'analyse de données...", duration=15, order=1)
    lesson1_2 = Lesson(module_id=module1_1.id, title="Outils essentiels", 
                       content="Présentation des outils...", duration=20, order=2)
    lesson2_1 = Lesson(module_id=module1_2.id, title="Séries et DataFrames", 
                       content="Découvrez les structures de données pandas...", duration=25, order=1)
    lesson2_2 = Lesson(module_id=module1_2.id, title="Manipulation de données", 
                       content="Filtrage, groupement et agrégation...", duration=30, order=2)
    
    course2 = Course(
        title="Web Development",
        description="Créez des sites web modernes avec HTML, CSS, JavaScript et React.",
        image_url="https://via.placeholder.com/300x200?text=Web+Dev"
    )
    db.session.add(course2)
    db.session.flush()
    
    module2_1 = Module(course_id=course2.id, title="HTML & CSS", order=1)
    module2_2 = Module(course_id=course2.id, title="JavaScript fondamentaux", order=2)
    module2_3 = Module(course_id=course2.id, title="Introduction à React", order=3)
    
    db.session.add_all([module2_1, module2_2, module2_3])
    db.session.flush()
    
    lesson3_1 = Lesson(module_id=module2_1.id, title="Structure HTML", 
                       content="Les bases du HTML...", duration=20, order=1)
    lesson3_2 = Lesson(module_id=module2_1.id, title="Styliser avec CSS", 
                       content="Sélecteurs, propriétés...", duration=25, order=2)
    
    db.session.add_all([lesson1_1, lesson1_2, lesson2_1, lesson2_2, lesson3_1, lesson3_2])
    db.session.commit()
    
    return jsonify({"message": "Cours de test créés avec succès"}), 201