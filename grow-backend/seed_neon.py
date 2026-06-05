from app import app, db
from models import User, Course, Module, Lesson, Quiz

with app.app_context():
    # 1. Créer l'admin
    admin = User(name='Admin GROW', email='admin@grow.com')
    admin.password = 'admin123'
    db.session.add(admin)
    db.session.commit()
    print("✅ Admin créé : admin@grow.com / admin123")

    # 2. Créer un utilisateur test
    test = User(name='Test User', email='test@test.com')
    test.password = '123456'
    db.session.add(test)
    db.session.commit()
    print("✅ Test créé : test@test.com / 123456")

    # 3. Cours 1 : Développement Web Complet
    c1 = Course(title='Développement Web Complet', description='Apprenez HTML, CSS, JavaScript, React et Node.js de A à Z.', image_url='https://picsum.photos/id/26/800/450')
    db.session.add(c1)
    db.session.commit()

    modules_c1 = [
        ('Introduction au Web', 1),
        ('HTML & CSS Fondamentaux', 2),
        ('JavaScript Moderne', 3),
        ('React.js', 4),
        ('Backend avec Node.js', 5),
    ]
    for title, order in modules_c1:
        m = Module(course_id=c1.id, title=title, order=order)
        db.session.add(m)
    db.session.commit()

    all_modules = Module.query.filter_by(course_id=c1.id).order_by(Module.order).all()

    lessons_data = {
        1: [('Comment fonctionne le Web', 'DNS, HTTP, navigateurs, serveurs...', 15), ('Outils du développeur', 'VS Code, Chrome DevTools, Git...', 20), ('Première page HTML', 'Structure de base HTML5...', 25)],
        2: [('Structure HTML5', 'Balises sémantiques header, nav, main...', 20), ('CSS Flexbox & Grid', 'Mise en page moderne...', 30), ('Responsive Design', 'Media queries, unités relatives...', 25)],
        3: [('Variables et Types', 'let, const, string, number, array...', 20), ('Fonctions et Événements', 'Arrow functions, event listeners...', 25), ('DOM Manipulation', 'querySelector, innerHTML, classList...', 30)],
        4: [('Introduction à React', 'Components, JSX, props...', 25), ('State et Hooks', 'useState, useEffect, règles...', 30), ('React Router', 'Navigation, useNavigate, Link...', 20)],
        5: [('Express.js', 'Créer un serveur, routes, middleware...', 25), ('Base de données MongoDB', 'Mongoose, schémas, modèles...', 30), ('API REST', 'CRUD, endpoints, bonnes pratiques...', 20)],
    }

    for module in all_modules:
        for title, content, duration in lessons_data.get(module.order, []):
            db.session.add(Lesson(module_id=module.id, title=title, content=content, duration=duration, order=len(Lesson.query.filter_by(module_id=module.id).all())+1))
    db.session.commit()
    print(f"✅ {Lesson.query.filter(Lesson.module_id.in_([m.id for m in all_modules])).count()} leçons créées")

    # Quiz pour le cours 1
    quizzes = [
        (all_modules[0].id, Lesson.query.filter_by(module_id=all_modules[0].id).first().id, 'Que signifie HTML ?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'A'),
        (all_modules[1].id, Lesson.query.filter_by(module_id=all_modules[1].id).first().id, 'Quelle propriété CSS centre avec Flexbox ?', 'text-align', 'justify-content', 'align-items', 'B'),
        (all_modules[2].id, Lesson.query.filter_by(module_id=all_modules[2].id).first().id, 'Comment déclarer une variable moderne en JS ?', 'var x = 5', 'int x = 5', 'let x = 5', 'C'),
        (all_modules[3].id, Lesson.query.filter_by(module_id=all_modules[3].id).first().id, 'Quel hook gère les effets ?', 'useState', 'useEffect', 'useContext', 'B'),
        (all_modules[4].id, Lesson.query.filter_by(module_id=all_modules[4].id).first().id, 'Framework Node.js le plus populaire ?', 'Django', 'Express', 'Laravel', 'B'),
    ]
    for module_id, lesson_id, q, a, b, c, correct in quizzes:
        db.session.add(Quiz(course_id=c1.id, lesson_id=lesson_id, question=q, option_a=a, option_b=b, option_c=c, correct_answer=correct))
    db.session.commit()
    print(f"✅ {len(quizzes)} quiz créés")

    # 4. Cours 2 : Python Data Science
    c2 = Course(title='Python pour la Data Science', description='Maîtrisez Python, Pandas, NumPy et Matplotlib.', image_url='https://picsum.photos/id/96/800/450')
    db.session.add(c2)
    db.session.commit()

    m2 = Module(course_id=c2.id, title='Fondamentaux Python', order=1)
    db.session.add(m2)
    db.session.commit()

    for title, content, dur in [('Variables et boucles', 'Types, if, for, while...', 20), ('Listes et dictionnaires', 'Collections de données...', 25), ('Fonctions et modules', 'def, import, packages...', 20)]:
        db.session.add(Lesson(module_id=m2.id, title=title, content=content, duration=dur, order=len(Lesson.query.filter_by(module_id=m2.id).all())+1))
    db.session.commit()

    lid = Lesson.query.filter_by(module_id=m2.id).first().id
    db.session.add(Quiz(course_id=c2.id, lesson_id=lid, question='Quel type utilise [] ?', option_a='Tuple', option_b='Liste', option_c='Dictionnaire', correct_answer='B'))
    db.session.commit()
    print(f"✅ Python Data Science : 3 leçons + 1 quiz")

    # 5. Cours 3 : UI/UX Design
    c3 = Course(title='UI/UX Design Masterclass', description='Design d\'interfaces modernes avec Figma.', image_url='https://picsum.photos/id/15/800/450')
    db.session.add(c3)
    db.session.commit()

    m3 = Module(course_id=c3.id, title='Design Fundamentals', order=1)
    db.session.add(m3)
    db.session.commit()

    for title, content, dur in [('Principes de design', 'Couleurs, typographie, espacement...', 20), ('Figma basics', 'Outils, frames, composants...', 30), ('Prototypage', 'Interactions, animations...', 25)]:
        db.session.add(Lesson(module_id=m3.id, title=title, content=content, duration=dur, order=len(Lesson.query.filter_by(module_id=m3.id).all())+1))
    db.session.commit()

    lid3 = Lesson.query.filter_by(module_id=m3.id).first().id
    db.session.add(Quiz(course_id=c3.id, lesson_id=lid3, question='Quel outil pour le design UI ?', option_a='Photoshop', option_b='Figma', option_c='Excel', correct_answer='B'))
    db.session.commit()
    print(f"✅ UI/UX Design : 3 leçons + 1 quiz")

    # Résumé final
    print(f"\n🎉 TERMINÉ !")
    print(f"📊 Users: {User.query.count()} | Courses: {Course.query.count()} | Modules: {Module.query.count()} | Leçons: {Lesson.query.count()} | Quiz: {Quiz.query.count()}")
