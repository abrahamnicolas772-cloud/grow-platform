from app import app, db
from models import Lesson

with app.app_context():
    lessons_content = {
        # Module 1 : Introduction au Web
        'Comment fonctionne le Web': '''
# Comment fonctionne le Web ?

## Le modèle Client-Serveur
Quand vous tapez une adresse web dans votre navigateur, une série d'événements se déclenche :
1. Votre navigateur envoie une requête HTTP au serveur
2. Le serveur traite la requête et renvoie une réponse
3. Le navigateur affiche le contenu reçu

## Protocoles essentiels
- **HTTP/HTTPS** : Le langage de communication entre navigateur et serveur
- **DNS** : Le système qui traduit les noms de domaine en adresses IP
- **TCP/IP** : Les protocoles qui assurent le transport des données

## Exercice pratique
Ouvrez les outils développeur (F12), allez dans l'onglet "Network" et observez les requêtes lorsque vous naviguez sur un site web.
''',

        'Outils développeur': '''
# Les Outils du Développeur Web

## Environnement de travail
Pour bien commencer, vous avez besoin de :
- **VS Code** : L'éditeur de code le plus populaire
- **Chrome DevTools** : Pour inspecter et déboguer vos pages
- **Git** : Pour versionner votre code

## Extensions VS Code recommandées
- **Live Server** : Prévisualisation en temps réel
- **Prettier** : Formatage automatique du code
- **ESLint** : Détection des erreurs JavaScript

## Premier projet
Créez un dossier "mon-premier-site" et ouvrez-le dans VS Code. C'est ici que tout commence !
''',

        'Première page HTML': '''
# Votre Première Page HTML

## Structure de base
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ma première page</title>
</head>
<body>
    <h1>Bonjour le monde !</h1>
    <p>Ceci est ma première page web.</p>
</body>
</html>
