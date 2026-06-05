from flask import Blueprint, request, jsonify
from models import db, Quiz, Enrollment, Lesson
from sqlalchemy.orm import joinedload

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/<int:lesson_id>', methods=['GET'])
def get_quiz(lesson_id):
    quiz = Quiz.query.filter_by(lesson_id=lesson_id).first()
    if not quiz:
        return jsonify({'error': 'No quiz for this lesson'}), 404
    # Récupérer course_id via la leçon
    course_id = quiz.lesson.module.course_id
    return jsonify({
        'id': quiz.id,
        'type': quiz.type,
        'question': quiz.question,
        'option_a': quiz.option_a,
        'option_b': quiz.option_b,
        'option_c': quiz.option_c,
        'correct_answer': quiz.correct_answer,
        'starterCode': quiz.starter_code,
        'expectedTest': quiz.expected_test,
        'course_id': course_id
    })

@quiz_bp.route('/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    user_id = data.get('userId')
    lesson_id = data.get('lessonId')
    answer = data.get('answer')
    quiz = Quiz.query.filter_by(lesson_id=lesson_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    is_correct = (answer == quiz.correct_answer)
    # Mise à jour de la progression (optionnel)
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=quiz.lesson.module.course_id).first()
    total_lessons = sum(len(mod.lessons) for mod in quiz.lesson.module.course.modules)
    completed = enrollment.completed_lessons if enrollment else 0
    progress = int((completed / total_lessons) * 100) if total_lessons else 0
    return jsonify({
        'correct': is_correct,
        'score': 1 if is_correct else 0,
        'course_progress': progress,
        'completed_lessons': completed,
        'total_lessons': total_lessons
    })

@quiz_bp.route('/code-submit', methods=['POST'])
def submit_code_quiz():
    data = request.get_json()
    user_id = data.get('userId')
    lesson_id = data.get('lessonId')
    code = data.get('code')
    is_correct = data.get('isCorrect')
    quiz = Quiz.query.filter_by(lesson_id=lesson_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    # Sauvegarder le code soumis (optionnel)
    # ...
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=quiz.lesson.module.course_id).first()
    total_lessons = sum(len(mod.lessons) for mod in quiz.lesson.module.course.modules)
    completed = enrollment.completed_lessons if enrollment else 0
    progress = int((completed / total_lessons) * 100) if total_lessons else 0
    return jsonify({
        'correct': is_correct,
        'score': 1 if is_correct else 0,
        'course_progress': progress,
        'completed_lessons': completed,
        'total_lessons': total_lessons
    })