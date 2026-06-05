import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models import db, Assignment
from datetime import datetime

assignments_bp = Blueprint('assignments', __name__)

UPLOAD_FOLDER = 'uploads/assignments'
ALLOWED_EXTENSIONS = {'js', 'py', 'html', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@assignments_bp.route('/submit', methods=['POST'])
def submit_assignment():
    user_id = request.form.get('user_id')
    module_id = request.form.get('module_id')
    course_id = request.form.get('course_id')
    code_text = request.form.get('code')
    file = request.files.get('file')
    
    if not user_id or not module_id or not course_id:
        return jsonify({'error': 'Missing required fields'}), 400
    if not code_text and not file:
        return jsonify({'error': 'Either code or file is required'}), 400
    
    file_name = None
    file_url = None
    final_code = code_text
    
    if file and allowed_file(file.filename):
        file_name = secure_filename(file.filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, f"{user_id}_{module_id}_{file_name}")
        file.save(file_path)
        file_url = file_path
        if not final_code:
            with open(file_path, 'r') as f:
                final_code = f.read()
    
    assignment = Assignment(
        user_id=user_id,
        module_id=module_id,
        course_id=course_id,
        code=final_code,
        file_name=file_name,
        file_url=file_url,
        submitted_at=datetime.utcnow()
    )
    db.session.add(assignment)
    db.session.commit()
    
    return jsonify({'message': 'Assignment submitted successfully', 'id': assignment.id}), 201

@assignments_bp.route('/user/<int:user_id>/course/<int:course_id>', methods=['GET'])
def get_user_assignments(user_id, course_id):
    assignments = Assignment.query.filter_by(user_id=user_id, course_id=course_id).all()
    return jsonify([{
        'id': a.id,
        'module_id': a.module_id,
        'code': a.code,
        'file_name': a.file_name,
        'submitted_at': a.submitted_at,
        'grade': a.grade,
        'feedback': a.feedback
    } for a in assignments])