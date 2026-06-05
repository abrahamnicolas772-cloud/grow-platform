from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grow.db'
db = SQLAlchemy(app)
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    image_url = db.Column(db.String(500))

class Module(db.Model):
    title = db.Column(db.String(200))
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
    passing_score = db.Column(db.Integer, default=70)
with app.app_context():
    db.create_all()
    
    # Cours
    course = Course(title='React Moderne 2025', description='Devenez expert React', image_url='https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg')
    db.session.add(course)
    db.session.commit()
    print('Cours cree: ID', course.id)
    
    # Module 1
    m1 = Module(title='Module 1: Fondamentaux React', course_id=course.id, order=1)
    db.session.add(m1)
    db.session.commit()
    
    # Lecons Module 1
    Lesson(title='Introduction a React', content='<h2>Bienvenue dans React</h2><p>React est une bibliotheque JavaScript creee par Facebook.</p><img src="https://reactjs.org/logo-og.png" width="150"/>', module_id=m1.id, order=1)
    Lesson(title='State avec useState', content='<h2>useState</h2><pre>const [count, setCount] = useState(0);</pre>', module_id=m1.id, order=3)
    print('Module 1: 3 lecons ajoutees')
    
    # Quiz 1
    Quiz(module_id=m1.id, questions=json.dumps([
        {'question': 'Hook pour etat?', 'options': ['useState', 'useEffect', 'useContext'], 'correct': 'useState'}
    db.session.commit()
    print('Quiz 1 ajoute')
    
    # Module 2
    m2 = Module(title='Module 2: Hooks Avances', course_id=course.id, order=2)
    db.session.add(m2)
    db.session.commit()
    
    # Lecons Module 2
    Lesson(title='useEffect', content='<h2>useEffect</h2><p>Pour les effets de bord</p><pre>useEffect(() => { console.log("effet"); }, []);</pre>', module_id=m2.id, order=1)
    Lesson(title='useContext', content='<h2>useContext</h2><p>Pour le state global</p><pre>const theme = useContext(ThemeContext);</pre>', module_id=m2.id, order=2)
    db.session.commit()
    print('Module 2: 2 lecons ajoutees')
    
    # Quiz 2
    Quiz(module_id=m2.id, questions=json.dumps([
        {'question': 'useEffect sert a...', 'options': ['Etat', 'Effets de bord', 'Rendu'], 'correct': 'Effets de bord'},
        {'question': 'useContext evite...', 'options': ['Prop drilling', 'Erreurs', 'Lenteur'], 'correct': 'Prop drilling'}
    ]), passing_score=70)
    db.session.commit()
    print('Quiz 2 ajoute')
    
    # Verification
    print('\n=== VERIFICATION ===')
    for m in Module.query.all():
        lessons = Lesson.query.filter_by(module_id=m.id).all()
        print(f'{m.title}: {len(lessons)} lecons')
            print(f'  - {l.title}')
    
    print('\nBackend prete sur http://localhost:5000')
