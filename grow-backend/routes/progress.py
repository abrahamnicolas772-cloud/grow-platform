from flask import Blueprint, request, jsonify
from models import db, User, Lesson, Module, UserProgress

bp = Blueprint('progress', __name__, url_prefix='/api/progress')

@bp.route('/lesson/<int:lesson_id>/complete', methods=['POST'])
def complete_lesson(lesson_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id requis"}), 400
    
    user = User.query.get(user_id)
    lesson = Lesson.query.get(lesson_id)
    if not user or not lesson:
        return jsonify({"error": "Utilisateur ou leçon non trouvé"}), 404
    
    existing = UserProgress.query.filter_by(user_id=user_id, lesson_id=lesson_id).first()
    if existing:
        return jsonify({"message": "Leçon déjà complétée"}), 200
    
    progress = UserProgress(
        user_id=user_id,
        course_id=lesson.module.course_id,
        lesson_id=lesson_id,
        completed=True
    )
    db.session.add(progress)
    db.session.commit()
    
    return jsonify({"message": "Leçon complétée"}), 201

@bp.route('/course/<int:course_id>/user/<int:user_id>', methods=['GET'])
def get_course_progress(course_id, user_id):
    completed = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).count()
    total = Lesson.query.join(Module).filter(Module.course_id == course_id).count()
    progress_percent = int(completed / total * 100) if total > 0 else 0
    return jsonify({
        "completed_lessons": completed,
        "total_lessons": total,
        "progress_percentage": progress_percent
    })