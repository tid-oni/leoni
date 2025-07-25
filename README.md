# FaceID Factory Access - Django + React + MySQL

Application de reconnaissance faciale pour contrôler l'accès aux machines dans un contexte industriel.

## Architecture

- **Backend**: Django + Django REST Framework
- **Frontend**: React
- **Base de données**: MySQL (via XAMPP)
- **Reconnaissance faciale**: face_recognition + OpenCV

## Structure du projet

```
face-id-factory/
├── backend/                    # API Django
│   ├── faceid_factory/        # Configuration Django
│   ├── agents/                # Gestion des utilisateurs
│   ├── machines/              # Gestion des machines
│   ├── interventions/         # Gestion des interventions
│   ├── face_recognition_app/  # Reconnaissance faciale
│   └── requirements.txt
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── pages/            # Pages de l'application
│   │   ├── contexts/         # Contextes React
│   │   └── services/         # Services API
│   └── package.json
└── README.md
```

## Installation et Configuration

### 1. Prérequis

- Python 3.8+
- Node.js 16+
- XAMPP (pour MySQL)
- Git

### 2. Configuration de la base de données (XAMPP)

1. Démarrez XAMPP et lancez MySQL
2. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
3. Créez une nouvelle base de données nommée `faceid_factory`

### 3. Installation du Backend Django

```bash
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows:
venv\Scripts\activate
# Sur macOS/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Effectuer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Charger les données de test (optionnel)
python manage.py loaddata fixtures/initial_data.json

# Démarrer le serveur de développement
python manage.py runserver
```

Le backend sera accessible sur http://localhost:8000

### 4. Installation du Frontend React

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le frontend sera accessible sur http://localhost:3000

## Utilisation

### Comptes de test

- **Admin**: admin@leoni.com / admin123
- **Qualité**: qualite1@leoni.com / password123
- **Maintenance**: maintenance1@leoni.com / password123

### Fonctionnalités principales

1. **Interface Machine**: Simulation de pannes et déverrouillage par Face ID
2. **Dashboard Admin**: Gestion des agents et consultation des interventions
3. **Dashboard Agent**: Consultation de l'historique personnel
4. **Reconnaissance faciale**: Vérification d'identité pour l'accès aux machines

### Workflow typique

1. Une panne est simulée sur une machine
2. L'interface demande une vérification Face ID
3. L'agent sélectionne son profil et scanne son visage
4. Le système vérifie l'identité et les autorisations
5. Si autorisé, la machine est déverrouillée et l'intervention est enregistrée

## API Endpoints

### Authentification
- `POST /api/auth/login/` - Connexion
- `GET /api/auth/profile/` - Profil utilisateur

### Agents
- `GET /api/auth/agents/` - Liste des agents
- `POST /api/auth/agents/` - Créer un agent
- `PUT /api/auth/agents/{id}/` - Modifier un agent
- `DELETE /api/auth/agents/{id}/` - Supprimer un agent

### Machines
- `GET /api/machines/` - Liste des machines
- `POST /api/machines/` - Créer une machine

### Interventions
- `GET /api/interventions/` - Liste des interventions
- `POST /api/interventions/` - Créer une intervention
- `POST /api/interventions/{id}/resolve/` - Résoudre une intervention

### Reconnaissance faciale
- `POST /api/face-recognition/verify/` - Vérifier Face ID
- `POST /api/face-recognition/upload-encoding/` - Upload encodage facial

## Configuration avancée

### Variables d'environnement (optionnel)

Créez un fichier `.env` dans le dossier backend pour personnaliser la configuration :

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_NAME=faceid_factory
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306
FACE_RECOGNITION_TOLERANCE=0.6
```

### Déploiement en production

1. Configurez une base de données MySQL en production
2. Modifiez `DEBUG = False` dans settings.py
3. Configurez les variables d'environnement appropriées
4. Utilisez un serveur web comme Nginx + Gunicorn pour Django
5. Buildez et servez l'application React

## Dépannage

### Erreurs communes

1. **Erreur de connexion MySQL**: Vérifiez que XAMPP est démarré et que MySQL fonctionne
2. **Erreur face_recognition**: Installez Visual Studio Build Tools sur Windows
3. **Erreur CORS**: Vérifiez la configuration CORS dans settings.py
4. **Erreur de caméra**: Autorisez l'accès à la caméra dans votre navigateur

### Logs

- Backend Django: Console où vous avez lancé `python manage.py runserver`
- Frontend React: Console du navigateur (F12)

## Développement

### Ajouter de nouvelles fonctionnalités

1. Backend: Créez de nouveaux modèles, serializers et vues dans les apps Django
2. Frontend: Ajoutez de nouveaux composants et services dans React
3. Testez les endpoints avec l'interface admin Django ou Postman

### Structure des données

- **Agent**: Utilisateur avec rôle (admin, qualité, maintenance)
- **Machine**: Équipement industriel avec localisation
- **Intervention**: Enregistrement d'accès à une machine
- **Face Encoding**: Données biométriques pour la reconnaissance

## Support

Pour toute question ou problème, consultez :
- Documentation Django: https://docs.djangoproject.com/
- Documentation React: https://reactjs.org/docs/
- Documentation face_recognition: https://face-recognition.readthedocs.io/