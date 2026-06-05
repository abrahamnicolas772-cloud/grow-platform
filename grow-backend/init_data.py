from app import app, db
from models import User, Course, Module, Lesson

with app.app_context():
    # Créer l'admin
    if not User.query.filter_by(email='admin@grow.com').first():
        admin = User(
            name='Admin',
            email='admin@grow.com',
            is_admin=True,
            email_verified=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        print("✅ Admin créé")
    else:
        print("✅ Admin existe déjà")
    
    # Créer les cours
    courses = [
        ('UI/UX Design', 'Master user-centered design principles...', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'),
        ('Full Stack Development', 'Master frontend and backend technologies...', 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg'),
        ('Digital Marketing', 'SEO, social media, and analytics...', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg')
    ]
    
    for title, desc, img in courses:
        course = Course.query.filter_by(title=title).first()
        if not course:
            course = Course(title=title, description=desc, image_url=img)
            db.session.add(course)
            db.session.commit()
            print(f"✅ Cours créé: {title}")
            
            # Ajouter 3 modules avec 3 leçons chacun
            for i in range(1, 4):
                module = Module(title=f"Module {i}: {title[:15]}...", course_id=course.id, order=i)
                db.session.add(module)
                db.session.commit()
                for j in range(1, 4):
                    lesson = Lesson(
                        title=f"Leçon {j}: Introduction",
                        content=f"<h2>{title} - Module {i}</h2><p>Contenu de la leçon {j}.</p>",
                        module_id=module.id,
                        duration=15,
                        order=j
                    )
                    db.session.add(lesson)
                db.session.commit()
                print(f"  - Module {i} créé avec 3 leçons")
        else:
            print(f"⚠️ Cours existe déjà: {title}")
    
    print("\n🎉 Initialisation terminée !")
    print("📧 admin@grow.com / admin123")
