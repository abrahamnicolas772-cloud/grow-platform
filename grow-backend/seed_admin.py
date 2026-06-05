import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from models import db, User

def seed_admin():
    with app.app_context():
        admin = User.query.filter_by(email='admin@grow.com').first()
        if not admin:
            admin = User(
                name='Admin',
                email='admin@grow.com',
                is_admin=True,
                email_verified=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin créé : admin@grow.com / admin123")
        else:
            print("✅ Admin existe déjà")

if __name__ == '__main__':
    seed_admin()
