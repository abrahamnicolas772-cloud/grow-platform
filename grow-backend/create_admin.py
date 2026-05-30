from app import app, db
from models import User, Enrollment, Course

with app.app_context():
    admin = User.query.filter_by(email='admin@grow.com').first()
    if admin:
        print("Admin existe déjà, mot de passe réinitialisé")
        admin.password = 'admin123'
    else:
        admin = User(name='Admin GROW', email='admin@grow.com', email_verified=True)
        admin.password = 'admin123'
        db.session.add(admin)
        db.session.commit()
        print("Admin créé avec succès")

    # Auto-inscription à tous les cours
    for c in Course.query.all():
        if not Enrollment.query.filter_by(user_id=admin.id, course_id=c.id).first():
            db.session.add(Enrollment(user_id=admin.id, course_id=c.id, payment_method='admin', payment_status='completed'))
    db.session.commit()
    print("Admin inscrit à tous les cours")