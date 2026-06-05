# scripts/seed_standalone.py
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Connexion directe à la base de données
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Récupérer l'URL de la base (même que dans ton app)
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("❌ DATABASE_URL non trouvée dans .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Import des modèles (assure-toi que models.py est accessible)
from models import Course, Module, Lesson, Quiz

def seed():
    # Supprimer l'ancien cours de démo s'il existe
    old = session.query(Course).filter_by(title="Full Stack JavaScript - Projet Devexpo").first()
    if old:
        # Supprimer les dépendances manuellement (SQLAlchemy le fait si cascade est bien configuré)
        for mod in old.modules:
            for lesson in mod.lessons:
                if lesson.quiz:
                    session.delete(lesson.quiz)
                session.delete(lesson)
            session.delete(mod)
        session.delete(old)
        session.commit()
        print("🗑️ Ancien cours supprimé.")

    # 1. Créer le cours
    course = Course(
        title="Full Stack JavaScript - Projet Devexpo",
        description="Apprenez à coder avec des exercices pratiques et un projet final.",
        price=29,
        image_url="https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg"
    )
    session.add(course)
    session.commit()

    # 2. Module 1
    module1 = Module(title="JavaScript Avancé", course_id=course.id, order=1)
    session.add(module1)
    session.commit()

    # 3. Leçon 1 (quiz code)
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
    session.add(lesson1)
    session.commit()

    quiz1 = Quiz(
        lesson_id=lesson1.id,
        type='code',
        question="Écrire une fonction `multiply(a, b)` qui retourne le produit de a et b.",
        starter_code="function multiply(a, b) {\n  // your code here\n}",
        expected_test="multiply(3,4) === 12"
    )
    session.add(quiz1)
    session.commit()

    # 4. Leçon 2 (quiz QCM)
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
    session.add(lesson2)
    session.commit()

    quiz2 = Quiz(
        lesson_id=lesson2.id,
        type='qcm',
        question="Que retourne `Promise.resolve(5).then(x => x * 2)` ?",
        option_a="5",
        option_b="10",
        option_c="undefined",
        correct_answer="B"
    )
    session.add(quiz2)
    session.commit()

    print("✅ Cours de démo créé avec succès !")
    print(f"   - Cours ID: {course.id}")
    print(f"   - Module ID: {module1.id}")
    print(f"   - Leçon 1 ID: {lesson1.id} (quiz code)")
    print(f"   - Leçon 2 ID: {lesson2.id} (quiz QCM)")

if __name__ == '__main__':
    seed()
    session.close()