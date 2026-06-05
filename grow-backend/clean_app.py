from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# MODELES
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))

class Module(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    order = db.Column(db.Integer)

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'))
    order = db.Column(db.Integer)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'))
    questions = db.Column(db.Text)
    passing_score = db.Column(db.Integer)

# ROUTES
@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify([{'id': c.id, 'title': c.title, 'description': c.description, 'image_url': c.image_url} for c in Course.query.all()])

@app.route('/api/courses/<int:course_id>/modules', methods=['GET'])
def get_modules(course_id):
    modules = Module.query.filter_by(course_id=course_id).order_by(Module.order).all()
    result = []
    for m in modules:
        lessons = Lesson.query.filter_by(module_id=m.id).order_by(Lesson.order).all()
        result.append({
            'id': m.id,
            'title': m.title,
            'order': m.order,
            'lessons': [{'id': l.id, 'title': l.title, 'content': l.content, 'order': l.order} for l in lessons]
        })
    return jsonify(result)

@app.route('/api/modules/<int:module_id>/quiz', methods=['GET'])
def get_quiz(module_id):
    q = Quiz.query.filter_by(module_id=module_id).first()
    if q:
        return jsonify({'id': q.id, 'questions': json.loads(q.questions), 'passing_score': q.passing_score})
    return jsonify({'error': 'No quiz'}), 404

# INITIALISATION
with app.app_context():
    db.create_all()
    
    # Nettoyage complet
    db.session.query(Lesson).delete()
    db.session.query(Quiz).delete()
    db.session.query(Module).delete()
    db.session.query(Course).delete()
    db.session.commit()
    
    # Cours unique
    course = Course(
        title='React Moderne 2025',
        description='Devenez expert React avec ce cours complet',
        image_url='https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg'
    )
    db.session.add(course)
    db.session.commit()
    print(f'Cours cree: {course.title}')
    
    # MODULE 1
    m1 = Module(title='Module 1: Les fondamentaux de React', course_id=course.id, order=1)
    db.session.add(m1)
    db.session.commit()
    
    # Lecons Module 1
    Lesson(title='1. Qu\'est-ce que React ?', 
           content='<h2>React en bref</h2><p>React est une bibliotheque JavaScript creee par Facebook en 2013.</p><img src="https://reactjs.org/logo-og.png" width="150"/><p>Elle permet de creer des interfaces utilisateur interactives.</p>', 
           module_id=m1.id, order=1)
    Lesson(title='2. Les composants', 
           content='<h2>Tout est composant</h2><p>Un composant est une fonction qui retourne du JSX.</p><pre style="background:#1e293b;padding:1rem;border-radius:8px">function Welcome() {\n  return &lt;h1&gt;Bonjour tout le monde&lt;/h1&gt;;\n}</pre>', 
           module_id=m1.id, order=2)
    Lesson(title='3. Les props', 
           content='<h2>Les props pour passer des donnees</h2><pre style="background:#1e293b;padding:1rem;border-radius:8px">function Welcome(props) {\n  return &lt;h1&gt;Bonjour {props.name}&lt;/h1&gt;;\n}\n\n&lt;Welcome name="Jean" /&gt;</pre>', 
           module_id=m1.id, order=3)
    Lesson(title='4. Le state avec useState', 
           content='<h2>Gerer l\'etat local</h2><pre style="background:#1e293b;padding:1rem;border-radius:8px">import { useState } from "react";\n\nfunction Compteur() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    &lt;button onClick={() => setCount(count + 1)}&gt;\n      Clics: {count}\n    &lt;/button&gt;\n  );\n}</pre>', 
           module_id=m1.id, order=4)
    db.session.commit()
    print(f'  Module 1: {Lesson.query.filter_by(module_id=m1.id).count()} lecons')
    
    # Quiz Module 1
    Quiz(module_id=m1.id, questions=json.dumps([
        {'question': 'React est developpe par quelle entreprise ?', 'options': ['Google', 'Facebook', 'Microsoft', 'Twitter'], 'correct': 'Facebook'},
        {'question': 'Qu\'est-ce qu\'un composant React ?', 'options': ['Une fonction qui retourne du JSX', 'Une classe CSS', 'Un fichier HTML', 'Une base de donnees'], 'correct': 'Une fonction qui retourne du JSX'},
        {'question': 'Quel hook permet de gerer l\'etat ?', 'options': ['useEffect', 'useState', 'useContext', 'useReducer'], 'correct': 'useState'},
        {'question': 'Comment passer des donnees a un composant ?', 'options': ['Par les props', 'Par le state', 'Par les hooks', 'Par le DOM'], 'correct': 'Par les props'}
    ]), passing_score=70)
    db.session.commit()
    print('  Quiz ajoute')
    
    # MODULE 2
    m2 = Module(title='Module 2: Les hooks avances', course_id=course.id, order=2)
    db.session.add(m2)
    db.session.commit()
    
    # Lecons Module 2
    Lesson(title='1. useEffect', 
           content='<h2>useEffect - Gerer les effets de bord</h2><p>useEffect permet d\'executer du code apres le rendu du composant.</p><pre style="background:#1e293b;padding:1rem;border-radius:8px">import { useState, useEffect } from "react";\n\nfunction Exemple() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = `Clics: ${count}`;\n  }, [count]);\n  \n  return &lt;button onClick={() => setCount(count + 1)}&gt;Click&lt;/button&gt;;\n}</pre><p>Le tableau de dependances controle quand l\'effet s\'execute.</p>', 
           module_id=m2.id, order=1)
    Lesson(title='2. useContext', 
           content='<h2>useContext - Partager des donnees globalement</h2><p>useContext permet d\'eviter le prop drilling.</p><pre style="background:#1e293b;padding:1rem;border-radius:8px">import { createContext, useContext } from "react";\n\nconst ThemeContext = createContext("light");\n\nfunction App() {\n  return (\n    &lt;ThemeContext.Provider value="dark"&gt;\n      &lt;Toolbar /&gt;\n    &lt;/ThemeContext.Provider&gt;\n  );\n}\n\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n  return &lt;div&gt;Theme actuel: {theme}&lt;/div&gt;;\n}</pre>', 
           module_id=m2.id, order=2)
    db.session.commit()
    print(f'  Module 2: {Lesson.query.filter_by(module_id=m2.id).count()} lecons')
    
    # Quiz Module 2
    Quiz(module_id=m2.id, questions=json.dumps([
        {'question': 'useEffect sert a...', 'options': ['Gerer l\'etat', 'Gerer les effets de bord', 'Crer des composants', 'Optimiser les performances'], 'correct': 'Gerer les effets de bord'},
        {'question': 'useContext permet d\'eviter...', 'options': ['Le prop drilling', 'Les erreurs', 'La lenteur', 'Le state'], 'correct': 'Le prop drilling'},
        {'question': 'Le tableau de dependances de useEffect sert a...', 'options': ['Optimiser', 'Controler quand l\'effet s\'execute', 'Declencher des erreurs', 'Rien'], 'correct': 'Controler quand l\'effet s\'execute'}
    ]), passing_score=70)
    db.session.commit()
    print('  Quiz ajoute')
    
    # VERIFICATION FINALE
    print('\n' + '='*50)
    print('VERIFICATION FINALE')
    print('='*50)
    for m in Module.query.all():
        lessons = Lesson.query.filter_by(module_id=m.id).all()
        quiz = Quiz.query.filter_by(module_id=m.id).first()
        print(f'\n{m.title}')
        print(f'  Lecons ({len(lessons)}):')
        for l in lessons:
            print(f'    - {l.title}')
        print(f'  Quiz: {"OK" if quiz else "MANQUANT"} - {quiz.passing_score if quiz else 0}% requis')
    
    print('\n✅ BASE PROPRE ET PRETE !')
    print('🔗 http://localhost:5000')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
