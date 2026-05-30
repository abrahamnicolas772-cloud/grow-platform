from flask import Blueprint, request, jsonify
from models import db, Quiz, UserProgress, User, Course, Module, Lesson
from datetime import datetime

bp = Blueprint('quiz', __name__, url_prefix='/api/quiz')  # ← LIGNE IMPORTANTE !

# GET /api/quiz?lesson_id=123
@bp.route('', methods=['GET'])
def get_quiz():
    lesson_id = request.args.get('lesson_id')
    
    if not lesson_id:
        return jsonify({"error": "lesson_id requis"}), 400
    
    quiz = Quiz.query.filter_by(lesson_id=lesson_id).first()
    
    if not quiz:
        return jsonify({"error": "Aucun quiz trouvé pour cette leçon"}), 404
    
    quiz_data = {
        'id': quiz.id,
        'course_id': quiz.course_id,
        'lesson_id': quiz.lesson_id,
        'question': quiz.question,
        'option_a': quiz.option_a,
        'option_b': quiz.option_b,
        'option_c': quiz.option_c
    }
    
    return jsonify(quiz_data)

# POST /api/quiz/submit
@bp.route('/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    
    required_fields = ['user_id', 'lesson_id', 'answer']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Tous les champs sont requis"}), 400
    
    user_id = data['user_id']
    lesson_id = data['lesson_id']
    user_answer = data['answer']
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    quiz = Quiz.query.filter_by(lesson_id=lesson_id).first()
    if not quiz:
        return jsonify({"error": "Quiz non trouvé"}), 404
    
    is_correct = quiz.check_answer(user_answer)
    score = 1 if is_correct else 0
    
    progress = UserProgress.query.filter_by(
        user_id=user_id,
        lesson_id=lesson_id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            course_id=quiz.course_id,
            lesson_id=lesson_id,
            quiz_score=score,
            quiz_completed=True,
            completed_at=datetime.utcnow() if is_correct else None
        )
        db.session.add(progress)
    else:
        if not progress.quiz_completed or score > progress.quiz_score:
            progress.quiz_score = score
            progress.quiz_completed = True
            if is_correct:
                progress.completed_at = datetime.utcnow()
    
    db.session.commit()
    
    # Compter les leçons via les modules
    modules = Module.query.filter_by(course_id=quiz.course_id).all()
    total_lessons = 0
    for module in modules:
        total_lessons += Lesson.query.filter_by(module_id=module.id).count()
    
    completed_lessons = UserProgress.query.filter_by(
        user_id=user_id,
        course_id=quiz.course_id,
        quiz_completed=True
    ).count()
    
    course_progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
    
    return jsonify({
        "correct": is_correct,
        "score": score,
        "message": "Bonne réponse !" if is_correct else f"Mauvaise réponse. La bonne réponse était {quiz.correct_answer}",
        "course_progress": course_progress,
        "completed_lessons": completed_lessons,
        "total_lessons": total_lessons
    })

# GET /api/quiz/progress/<user_id>/<course_id>
@bp.route('/progress/<int:user_id>/<int:course_id>', methods=['GET'])
def get_progress(user_id, course_id):
    # Récupérer les leçons via les modules
    modules = Module.query.filter_by(course_id=course_id).all()
    lessons = []
    for module in modules:
        module_lessons = Lesson.query.filter_by(module_id=module.id).all()
        lessons.extend(module_lessons)
    
    total_lessons = len(lessons)
    
    progress = UserProgress.query.filter_by(
        user_id=user_id,
        course_id=course_id,
        quiz_completed=True
    ).all()
    
    completed_lessons = len(progress)
    course_progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
    
    total_score = sum(p.quiz_score for p in progress)
    
    return jsonify({
        "user_id": user_id,
        "course_id": course_id,
        "completed_lessons": completed_lessons,
        "total_lessons": total_lessons,
        "progress_percentage": course_progress,
        "total_score": total_score,
        "max_score": total_lessons
    })

# POST /api/quiz/seed
@bp.route('/seed', methods=['POST'])
def seed_quizzes():
    if Quiz.query.count() > 0:
        return jsonify({"message": "Des quiz existent déjà"}), 400
    
    data_analysis = Course.query.filter_by(title="Data Analysis").first()
    web_dev = Course.query.filter_by(title="Web Development").first()
    
    if not data_analysis or not web_dev:
        return jsonify({"error": "Créez d'abord les cours avec /api/courses/seed"}), 400
    
    modules_data = Module.query.filter_by(course_id=data_analysis.id).all()
    modules_web = Module.query.filter_by(course_id=web_dev.id).all()
    
    lessons_data = []
    for module in modules_data:
        module_lessons = Lesson.query.filter_by(module_id=module.id).all()
        lessons_data.extend(module_lessons)
    
    lessons_web = []
    for module in modules_web:
        module_lessons = Lesson.query.filter_by(module_id=module.id).all()
        lessons_web.extend(module_lessons)
    
    if len(lessons_data) < 1 or len(lessons_web) < 1:
        return jsonify({"error": "Aucune leçon trouvée pour ces cours"}), 400
    
    quiz1 = Quiz(
        course_id=data_analysis.id,
        lesson_id=lessons_data[0].id,
        question="Qu'est-ce que Pandas en Python ?",
        option_a="Une bibliothèque d'analyse de données",
        option_b="Un animal",
        option_c="Un éditeur de texte",
        correct_answer="A"
    )
    
    quiz2 = Quiz(
        course_id=data_analysis.id,
        lesson_id=lessons_data[1].id if len(lessons_data) > 1 else lessons_data[0].id,
        question="Quelle structure de données utilise-t-on dans Pandas ?",
        option_a="Listes",
        option_b="DataFrames",
        option_c="Dictionnaires",
        correct_answer="B"
    )
    
    quiz3 = Quiz(
        course_id=web_dev.id,
        lesson_id=lessons_web[0].id,
        question="Que signifie HTML ?",
        option_a="Hyper Text Markup Language",
        option_b="High Tech Modern Language",
        option_c="Home Tool Markup Language",
        correct_answer="A"
    )
    
    quiz4 = Quiz(
        course_id=web_dev.id,
        lesson_id=lessons_web[1].id if len(lessons_web) > 1 else lessons_web[0].id,
        question="Quel langage est utilisé pour le style des pages web ?",
        option_a="JavaScript",
        option_b="Python",
        option_c="CSS",
        correct_answer="C"
    )
    
    db.session.add_all([quiz1, quiz2, quiz3, quiz4])
    db.session.commit()
    
    return jsonify({"message": "Quiz de test créés avec succès", "count": 4}), 201