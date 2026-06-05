import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app import app, db
from models import Course, Module, Lesson, Quiz

def seed():
    with app.app_context():
        # Supprimer l'ancien cours de démo si existant
        old = Course.query.filter_by(title="Full Stack JavaScript - Projet Devexpo").first()
        if old:
            for mod in old.modules:
                for lesson in mod.lessons:
                    db.session.delete(lesson)
                db.session.delete(mod)
            db.session.delete(old)
            db.session.commit()

        # 1. Cours principal
        course = Course(
            title="Full Stack JavaScript - Projet Devexpo",
            description="Apprenez à coder avec des exercices pratiques et un projet final.",
            price=29,
            image_url="https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg"
        )
        db.session.add(course)
        db.session.commit()

        # 2. Module 1 : Fondamentaux JS
        module1 = Module(title="JavaScript Avancé", course_id=course.id, order=1)
        db.session.add(module1)
        db.session.commit()

        # 3. Leçon 1 : Fonctions et Scope (contenu riche)
        lesson1 = Lesson(
            title="Fonctions et Scope",
            content="""<h2>Les fonctions en JavaScript</h2>
            <p>Une fonction est un bloc de code réutilisable.</p>
            <img src="https://i.postimg.cc/3wxVp0ny/photo-2026-05-26-11-00-53.jpg" alt="Fonctions JS" style="width:100%; border-radius:12px;" />
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
            <p>Exemple : <code>function add(a,b) { return a+b; }</code></p>
            <h3>Exercice</h3>
            <p>Dans le quiz, vous devrez écrire une fonction <code>multiply</code>.</p>""",
            module_id=module1.id,
            order=1,
            duration=15
        )
        db.session.add(lesson1)
        db.session.commit()

        # 4. Quiz de code pour la leçon 1
        quiz1 = Quiz(
            lesson_id=lesson1.id,
            type='code',
            question="Écrire une fonction `multiply(a, b)` qui retourne le produit de a et b.",
            starter_code="function multiply(a, b) {\n  // your code here\n}",
            expected_test="multiply(3,4) === 12"
        )
        db.session.add(quiz1)
        db.session.commit()

        # 5. Leçon 2 : Promesses et async/await
        lesson2 = Lesson(
            title="Promesses et Async/Await",
            content="""<h2>Gérer l'asynchrone en JS</h2>
            <p>Les promesses permettent de gérer des opérations asynchrones.</p>
            <pre><code>fetch('https://api.example.com')
  .then(response => response.json())
  .then(data => console.log(data));</code></pre>
            <p>Async/await rend le code plus lisible.</p>""",
            module_id=module1.id,
            order=2,
            duration=20
        )
        db.session.add(lesson2)
        db.session.commit()

        # 6. Quiz QCM pour la leçon 2
        quiz2 = Quiz(
            lesson_id=lesson2.id,
            type='qcm',
            question="Que retourne `Promise.resolve(5).then(x => x * 2)` ?",
            option_a="5",
            option_b="10",
            option_c="undefined",
            correct_answer="B"
        )
        db.session.add(quiz2)
        db.session.commit()

        print("✅ Cours de démo créé avec succès !")
        print(f"   - Cours ID: {course.id}")
        print(f"   - Module ID: {module1.id}")
        print(f"   - Leçon 1 ID: {lesson1.id} (quiz code)")
        print(f"   - Leçon 2 ID: {lesson2.id} (quiz QCM)")

if __name__ == '__main__':
    seed()