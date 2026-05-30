from app import app, db
from models import Course, Module, Lesson, Quiz, User

with app.app_context():
    if not User.query.filter_by(email='admin@grow.com').first():
        admin = User(name='Admin GROW', email='admin@grow.com')
        admin.password = 'admin123'
        db.session.add(admin)
        db.session.commit()
        print("Admin cree")

    c = Course.query.filter_by(title='Developpement Web Complet').first()
    if not c:
        c = Course(title='Developpement Web Complet', description='Apprenez HTML, CSS, JS, React, Node.js.', image_url='https://picsum.photos/id/26/800/450')
        db.session.add(c)
        db.session.commit()

        for t, o in [('Module 1',1),('Module 2',2),('Module 3',3),('Module 4',4),('Module 5',5)]:
            db.session.add(Module(course_id=c.id, title=t, order=o))
        db.session.commit()

        modules = Module.query.filter_by(course_id=c.id).order_by(Module.order).all()
        data = {1:[('Web','...',15),('Outils','...',20),('HTML','...',25)],2:[('HTML5','...',20),('CSS','...',30),('Responsive','...',25)],3:[('Variables','...',20),('Fonctions','...',25),('DOM','...',30)],4:[('React','...',25),('Hooks','...',30),('Router','...',20)],5:[('Express','...',25),('MongoDB','...',30),('API','...',20)]}
        for m in modules:
            for t, co, d in data.get(m.order,[]):
                db.session.add(Lesson(module_id=m.id, title=t, content=co, duration=d, order=len(Lesson.query.filter_by(module_id=m.id).all())+1))
        db.session.commit()

        qs = [(1,'HTML?','Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','A'),(4,'CSS flex?','text-align','justify-content','align','B'),(7,'JS var?','var x=5','int x=5','let x=5','C'),(10,'Hook?','useState','useEffect','useContext','B'),(13,'Node framework?','Django','Express','Laravel','B')]
        for lid,q,a,bc,cc,cor in qs:
            db.session.add(Quiz(course_id=c.id, lesson_id=lid, question=q, option_a=a, option_b=bc, option_c=cc, correct_answer=cor))
        db.session.commit()

        c2 = Course(title='Python Data Science', description='Python, Pandas, NumPy.', image_url='https://picsum.photos/id/96/800/450')
        db.session.add(c2)
        db.session.commit()
        m2 = Module(course_id=c2.id, title='Python Basics', order=1)
        db.session.add(m2)
        db.session.commit()
        for t,co,d in [('Variables','...',20),('Listes','...',25),('Fonctions','...',20)]:
            db.session.add(Lesson(module_id=m2.id, title=t, content=co, duration=d, order=len(Lesson.query.filter_by(module_id=m2.id).all())+1))
        db.session.commit()
        lid = Lesson.query.filter_by(module_id=m2.id).first().id
        db.session.add(Quiz(course_id=c2.id, lesson_id=lid, question='Type []?', option_a='Tuple', option_b='Liste', option_c='Dict', correct_answer='B'))
        db.session.commit()

    print(f"DONE! Courses:{Course.query.count()} Modules:{Module.query.count()} Lessons:{Lesson.query.count()} Quiz:{Quiz.query.count()}")
