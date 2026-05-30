from app import app, db
from models import Lesson

with app.app_context():
    lessons = Lesson.query.all()
    
    content_map = {
        # Module 1 - Intro Web
        'Comment fonctionne le Web': '''<h2>Comment fonctionne le Web ?</h2><p>Le Web repose sur un modèle <strong>client-serveur</strong>. Quand vous tapez une URL :</p><ol><li>Votre navigateur envoie une requête HTTP au serveur</li><li>Le serveur traite la demande et renvoie une réponse</li><li>Le navigateur affiche le contenu</li></ol><h3>Protocoles clés</h3><ul><li><strong>HTTP/HTTPS</strong> : Langage de communication</li><li><strong>DNS</strong> : Traduit les noms de domaine en IP</li><li><strong>TCP/IP</strong> : Transport des données</li></ul>''',
        
        'Outils du développeur': '''<h2>Les Outils Essentiels</h2><h3>VS Code</h3><p>L'éditeur de code le plus populaire. Gratuit, extensible, intégré à Git.</p><h3>Chrome DevTools</h3><p>Inspectez, débuguez et testez vos pages web en temps réel (F12).</p><h3>Git & GitHub</h3><p>Versionnez votre code et collaborez avec d'autres développeurs.</p><h3>Extensions recommandées</h3><ul><li>Live Server</li><li>Prettier</li><li>ESLint</li></ul>''',
        
        'Première page HTML': '''<h2>Votre Première Page HTML</h2><pre><code>&lt;!DOCTYPE html&gt;&lt;html lang="fr"&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Ma page&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&lt;h1&gt;Bonjour !&lt;/h1&gt;&lt;p&gt;Ceci est ma première page.&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</code></pre><h3>Balises essentielles</h3><ul><li>&lt;h1&gt; à &lt;h6&gt; : Titres</li><li>&lt;p&gt; : Paragraphes</li><li>&lt;a&gt; : Liens</li><li>&lt;img&gt; : Images</li></ul>''',

        # Module 2 - HTML & CSS
        'Structure HTML5': '''<h2>HTML5 Sémantique</h2><p>HTML5 apporte des balises qui donnent du <strong>sens</strong> au contenu :</p><ul><li><code>&lt;header&gt;</code> : En-tête</li><li><code>&lt;nav&gt;</code> : Navigation</li><li><code>&lt;main&gt;</code> : Contenu principal</li><li><code>&lt;article&gt;</code> : Article indépendant</li><li><code>&lt;footer&gt;</code> : Pied de page</li></ul><p>Avantages : meilleur SEO, accessibilité, code plus lisible.</p>''',
        
        'CSS Flexbox & Grid': '''<h2>Flexbox & Grid</h2><h3>Flexbox (1 dimension)</h3><pre><code>.container { display: flex; justify-content: center; align-items: center; gap: 20px; }</code></pre><h3>Grid (2 dimensions)</h3><pre><code>.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }</code></pre><p>Flexbox = ligne OU colonne. Grid = lignes ET colonnes. Les deux se combinent !</p>''',
        
        'Responsive Design': '''<h2>Responsive Design</h2><p>Un site responsive s'adapte à tous les écrans.</p><h3>Media Queries</h3><pre><code>@media (max-width: 768px) { .container { flex-direction: column; } }</code></pre><h3>Unités responsives</h3><ul><li>% : Pourcentage du parent</li><li>vw/vh : Viewport</li><li>rem : Relatif à la racine</li></ul><p>Testez avec Chrome DevTools (Ctrl+Shift+M).</p>''',

        # Module 3 - JavaScript
        'Variables et Types': '''<h2>Variables et Types</h2><h3>Déclaration</h3><pre><code>let nom = "Jean";   // modifiable
const age = 25;     // constante
// var = à éviter</code></pre><h3>Types</h3><ul><li><code>string</code> : "Hello"</li><li><code>number</code> : 42</li><li><code>boolean</code> : true/false</li><li><code>array</code> : [1, 2, 3]</li><li><code>object</code> : {nom: "Jean"}</li></ul><p>💡 Utilisez <code>const</code> par défaut, <code>let</code> si la variable change.</p>''',
        
        'Fonctions et Événements': '''<h2>Fonctions & Événements</h2><h3>Fonctions</h3><pre><code>function addition(a, b) { return a + b; }
const multiplication = (a, b) => a * b; // arrow function</code></pre><h3>Événements</h3><pre><code>button.addEventListener('click', () => { alert('Clic !'); });
form.addEventListener('submit', (e) => { e.preventDefault(); });</code></pre><p>Les événements rendent vos pages interactives !</p>''',
        
        'DOM Manipulation': '''<h2>Manipulation du DOM</h2><h3>Sélectionner</h3><pre><code>document.querySelector('p')
document.getElementById('id')
document.querySelectorAll('.classe')</code></pre><h3>Modifier</h3><pre><code>element.textContent = "Nouveau"
element.style.color = "red"
element.classList.add('actif')</code></pre><p>Le DOM est l'arbre qui représente votre page. JavaScript peut le modifier en temps réel.</p>''',

        # Module 4 - React
        'Introduction à React': '''<h2>React.js</h2><p>Bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur.</p><h3>Concepts clés</h3><ul><li><strong>Composants</strong> : Briques réutilisables</li><li><strong>JSX</strong> : HTML dans JavaScript</li><li><strong>Props</strong> : Données parent → enfant</li><li><strong>State</strong> : Données internes</li></ul><pre><code>function Welcome() { return &lt;h1&gt;Bonjour !&lt;/h1&gt;; }</code></pre>''',
        
        'State et Hooks': '''<h2>State & Hooks</h2><h3>useState</h3><pre><code>const [count, setCount] = useState(0);
&lt;button onClick={() => setCount(count + 1)}&gt;+1&lt;/button&gt;</code></pre><h3>useEffect</h3><pre><code>useEffect(() => { fetchData(); }, []);</code></pre><p>Les Hooks sont le cœur de React moderne. Ils gèrent l'état et les effets de bord.</p>''',
        
        'React Router': '''<h2>React Router</h2><h3>Installation</h3><pre><code>npm install react-router-dom</code></pre><h3>Configuration</h3><pre><code>&lt;Routes&gt;&lt;Route path="/" element={&lt;Home /&gt;} /&gt;&lt;Route path="/about" element={&lt;About /&gt;} /&gt;&lt;/Routes&gt;</code></pre><h3>Navigation</h3><pre><code>const navigate = useNavigate();
navigate('/dashboard');</code></pre>''',

        # Module 5 - Backend
        'Express.js': '''<h2>Express.js</h2><p>Framework Node.js pour créer des serveurs web.</p><pre><code>const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello'));
app.listen(3000);</code></pre><h3>Routes</h3><pre><code>app.get('/api/users', (req, res) => res.json(users));
app.post('/api/users', (req, res) => res.status(201).json(newUser));</code></pre>''',
        
        'Base de données': '''<h2>MongoDB & Mongoose</h2><p>Base NoSQL orientée documents.</p><h3>Connexion</h3><pre><code>mongoose.connect('mongodb://localhost/maBase');</code></pre><h3>Modèle</h3><pre><code>const User = mongoose.model('User', { nom: String, email: String });
const user = new User({ nom: 'Jean' });
await user.save();</code></pre>''',
        
        'API REST': '''<h2>API REST</h2><table><tr><th>Méthode</th><th>URL</th><th>Action</th></tr><tr><td>GET</td><td>/api/users</td><td>Lire</td></tr><tr><td>POST</td><td>/api/users</td><td>Créer</td></tr><tr><td>PUT</td><td>/api/users/:id</td><td>Modifier</td></tr><tr><td>DELETE</td><td>/api/users/:id</td><td>Supprimer</td></tr></table><p>Une API REST expose des ressources via des URLs. C'est le standard du web moderne.</p>''',

        # Python Data Science
        'Variables et boucles': '''<h2>Variables et Boucles</h2><pre><code>nom = "Python"
age = 30
if age >= 18: print("Majeur")
for i in range(5): print(i)</code></pre><p>Python est connu pour sa syntaxe claire et lisible.</p>''',
        'Listes et dictionnaires': '''<h2>Listes & Dictionnaires</h2><pre><code>liste = [1, 2, 3]
liste.append(4)
dico = {"nom": "Jean", "age": 25}
print(dico["nom"])</code></pre><p>Les listes et dictionnaires sont les structures de données fondamentales.</p>''',
        'Fonctions et modules': '''<h2>Fonctions & Modules</h2><pre><code>def addition(a, b): return a + b
import math
print(math.sqrt(16))</code></pre><p>Organisez votre code avec des fonctions et importez des modules.</p>''',
    }
    
    updated = 0
    for lesson in lessons:
        if lesson.title in content_map:
            lesson.content = content_map[lesson.title]
            updated += 1
    
    db.session.commit()
    print(f"✅ {updated} leçons mises à jour avec du contenu !")
