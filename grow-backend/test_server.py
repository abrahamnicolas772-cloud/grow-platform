from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify([
        {'id': 1, 'title': 'React Moderne 2025', 'description': 'Apprenez React', 'image_url': 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg'},
        {'id': 2, 'title': 'UX/UI Design', 'description': 'Design d\'interfaces', 'image_url': 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'}
    ])

@app.route('/api/courses/1/modules', methods=['GET'])
def get_modules():
    return jsonify([
        {'id': 1, 'title': 'Module 1: Bases de React', 'order': 1, 'lessons': [
            {'id': 1, 'title': 'Introduction à React', 'content': '<h2>React</h2><p>Bibliothèque JavaScript</p>', 'order': 1},
            {'id': 2, 'title': 'Composants et Props', 'content': '<h2>Props</h2><p>Données immutables</p>', 'order': 2},
            {'id': 3, 'title': 'State avec useState', 'content': '<h2>useState</h2><pre>const [count, setCount] = useState(0)</pre>', 'order': 3}
        ]},
        {'id': 2, 'title': 'Module 2: Hooks Avancés', 'order': 2, 'lessons': [
            {'id': 4, 'title': 'useEffect', 'content': '<h2>useEffect</h2><p>Effets de bord</p>', 'order': 1},
            {'id': 5, 'title': 'useContext', 'content': '<h2>useContext</h2><p>State global</p>', 'order': 2}
        ]}
    ])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
