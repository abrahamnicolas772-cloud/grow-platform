import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from models import db, Course, Module, Lesson

def seed():
    with app.app_context():
        # Nettoyage
        db.session.query(Lesson).delete()
        db.session.query(Module).delete()
        db.session.query(Course).delete()
        db.session.commit()

        courses_data = [
            {
                "title": "UI/UX Design",
                "description": "Master user-centered design principles and create stunning interfaces.",
                "image_url": "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
            },
            {
                "title": "Full Stack Development",
                "description": "Master frontend and backend technologies with React and Node.js.",
                "image_url": "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg"
            },
            {
                "title": "Digital Marketing",
                "description": "SEO, social media, and analytics for modern marketers.",
                "image_url": "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg"
            }
        ]

        for data in courses_data:
            course = Course(**data)
            db.session.add(course)
            db.session.commit()
            print(f"✅ Cours créé : {course.title}")

            for i in range(1, 4):
                module = Module(
                    title=f"Module {i} : {course.title[:20]}",
                    course_id=course.id,
                    order=i
                )
                db.session.add(module)
                db.session.commit()

                for j in range(1, 4):
                    lesson = Lesson(
                        title=f"Leçon {j} : Introduction",
                        content=f"<h2>{course.title} - Module {i}</h2><p>Contenu de la leçon {j}.</p><img src='https://picsum.photos/id/{i*10 + j}/600/300' style='max-width:100%; border-radius:12px; margin:1rem 0;'/>",
                        module_id=module.id,
                        duration=15,
                        order=j
                    )
                    db.session.add(lesson)
                db.session.commit()
                print(f"  - Module {i} créé avec 3 leçons")

        print("\n🎉 Tous les cours ont été créés !")

if __name__ == '__main__':
    seed()
