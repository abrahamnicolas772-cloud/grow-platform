from flask import Blueprint, request, jsonify
from models import db, User

bp = Blueprint('users', __name__, url_prefix='/api')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Tous les champs sont requis"}), 400
    
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Cet email est déjà utilisé"}), 400
    
    new_user = User(
        name=data['name'],
        email=data['email']
    )
    new_user.password = data['password']
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "message": "Inscription réussie",
        "user": new_user.to_dict()
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email et mot de passe requis"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.verify_password(data['password']):
        return jsonify({
            "message": "Connexion réussie",
            "user": user.to_dict()
        }), 200
    
    return jsonify({"error": "Email ou mot de passe incorrect"}), 401

@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])