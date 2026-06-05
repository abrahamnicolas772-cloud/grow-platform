# ========== NOUVEAUX MODÈLES ==========

class Assignment(db.Model):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    max_score = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    module = db.relationship('Module', backref='assignments')
    submissions = db.relationship('Submission', backref='assignment', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'module_id': self.module_id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'max_score': self.max_score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Submission(db.Model):
    __tablename__ = 'submissions'
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_url = db.Column(db.String(500), nullable=True)
    content = db.Column(db.Text, nullable=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='submissions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'assignment_id': self.assignment_id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else None,
            'file_url': self.file_url,
            'content': self.content,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        }

class Grade(db.Model):
    __tablename__ = 'grades'
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    graded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    graded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    submission = db.relationship('Submission', backref='grade')
    
    def to_dict(self):
        return {
            'id': self.id,
            'submission_id': self.submission_id,
            'score': self.score,
            'feedback': self.feedback,
            'graded_by': self.graded_by,
            'graded_at': self.graded_at.isoformat() if self.graded_at else None
        }

        # ========== ROUTES DEVOIRS ET NOTES ==========

# Admin : Créer un devoir pour un module
@app.route('/api/admin/modules/<int:module_id>/assignments', methods=['POST'])
def create_assignment(module_id):
    if not session.get('is_admin'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    assignment = Assignment(
        module_id=module_id,
        title=data['title'],
        description=data.get('description', ''),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        max_score=data.get('max_score', 100)
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify(assignment.to_dict()), 201

# Admin : Récupérer tous les devoirs d'un module
@app.route('/api/admin/modules/<int:module_id>/assignments', methods=['GET'])
def get_module_assignments(module_id):
    assignments = Assignment.query.filter_by(module_id=module_id).all()
    result = []
    for a in assignments:
        a_dict = a.to_dict()
        a_dict['submissions_count'] = Submission.query.filter_by(assignment_id=a.id).count()
        a_dict['graded_count'] = db.session.query(Grade).join(Submission).filter(Submission.assignment_id == a.id).count()
        result.append(a_dict)
    return jsonify(result), 200

# Admin : Voir toutes les soumissions d'un devoir avec notes
@app.route('/api/admin/assignments/<int:assignment_id>/submissions', methods=['GET'])
def get_assignment_submissions(assignment_id):
    if not session.get('is_admin'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    submissions = Submission.query.filter_by(assignment_id=assignment_id).all()
    result = []
    for s in submissions:
        s_dict = s.to_dict()
        grade = Grade.query.filter_by(submission_id=s.id).first()
        s_dict['grade'] = grade.to_dict() if grade else None
        result.append(s_dict)
    return jsonify(result), 200

# Admin : Noter une soumission
@app.route('/api/admin/submissions/<int:submission_id>/grade', methods=['POST'])
def grade_submission(submission_id):
    if not session.get('is_admin'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    existing = Grade.query.filter_by(submission_id=submission_id).first()
    if existing:
        existing.score = data['score']
        existing.feedback = data.get('feedback', '')
        existing.graded_at = datetime.utcnow()
    else:
        grade = Grade(
            submission_id=submission_id,
            score=data['score'],
            feedback=data.get('feedback', ''),
            graded_by=session.get('user_id')
        )
        db.session.add(grade)
    db.session.commit()
    return jsonify({'message': 'Graded successfully'}), 200

# Étudiant : Déposer un devoir
@app.route('/api/assignments/<int:assignment_id>/submit', methods=['POST'])
def submit_assignment(assignment_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Vérifier si l'étudiant est inscrit au cours
    assignment = Assignment.query.get_or_404(assignment_id)
    module = Module.query.get(assignment.module_id)
    enrollment = Enrollment.query.filter_by(user_id=user_id, course_id=module.course_id).first()
    if not enrollment:
        return jsonify({'error': 'Not enrolled in this course'}), 403
    
    # Vérifier si déjà soumis
    existing = Submission.query.filter_by(assignment_id=assignment_id, user_id=user_id).first()
    if existing:
        return jsonify({'error': 'Already submitted'}), 400
    
    data = request.get_json()
    submission = Submission(
        assignment_id=assignment_id,
        user_id=user_id,
        file_url=data.get('file_url'),
        content=data.get('content')
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify(submission.to_dict()), 201

# Étudiant : Voir ses notes pour un cours
@app.route('/api/courses/<int:course_id>/my-grades', methods=['GET'])
def get_my_grades(course_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    modules = Module.query.filter_by(course_id=course_id).all()
    result = []
    for module in modules:
        assignments = Assignment.query.filter_by(module_id=module.id).all()
        for assignment in assignments:
            submission = Submission.query.filter_by(assignment_id=assignment.id, user_id=user_id).first()
            grade = Grade.query.filter_by(submission_id=submission.id).first() if submission else None
            result.append({
                'module_title': module.title,
                'assignment_title': assignment.title,
                'submitted': submission is not None,
                'submitted_at': submission.submitted_at.isoformat() if submission else None,
                'score': grade.score if grade else None,
                'max_score': assignment.max_score,
                'feedback': grade.feedback if grade else None
            })
    return jsonify(result), 200

# Upload de fichier pour devoir
UPLOAD_FOLDER = 'uploads/assignments'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'zip', 'txt', 'jpg', 'png'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload/assignment', methods=['POST'])
def upload_assignment_file():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{user_id}_{datetime.now().timestamp()}_{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({'url': f'/uploads/assignments/{filename}'}), 200
    
    return jsonify({'error': 'File type not allowed'}), 400

# Servir les fichiers uploadés
from flask import send_from_directory
@app.route('/uploads/assignments/<filename>')
def uploaded_assignment(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)