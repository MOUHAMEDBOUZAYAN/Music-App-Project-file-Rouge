# 📁 Organisation des Scripts SoundWave

## 🚀 **Scripts de Démarrage (.bat)**

Ces fichiers sont des **scripts Windows** qui automatisent le démarrage :

### Dans le dossier racine :
- **`start-complete.bat`** - Script principal qui installe tout et démarre les deux serveurs
- **`start-backend.bat`** - Lance seulement le backend
- **`start-frontend.bat`** - Lance seulement le frontend
- **`start-both.bat`** - Lance les deux serveurs en parallèle
- **`test-backend.js`** - Test simple de connexion au backend

### Comment utiliser :
1. Double-cliquer sur `start-complete.bat` (recommandé)
2. Ou utiliser les scripts individuels selon vos besoins

## 🧪 **Scripts de Test**

### Dans `soundwave-backend/` :
- **`test-server.js`** - Test simple de connexion
- **`tests/connection.test.js`** - Suite de tests complète

### Commandes disponibles :
```bash
# Test simple
npm run test:connection

# Tests complets
npm run test:all

# Tests Jest (unitaires)
npm test
```

## 📂 **Structure Recommandée**

```
SoundWave-Music/
├── start-complete.bat          # Script principal
├── start-backend.bat           # Backend seulement
├── start-frontend.bat          # Frontend seulement
├── test-backend.js             # Test simple
├── soundwave-backend/
│   ├── test-server.js          # Test backend
│   ├── tests/
│   │   └── connection.test.js  # Tests complets
│   └── package.json            # Scripts npm
└── soundwave-frontend/
    └── package.json            # Scripts npm
```

## 🔧 **Utilisation Recommandée**

1. **Première fois** : Utiliser `start-complete.bat`
2. **Développement** : Utiliser les scripts individuels
3. **Tests** : Utiliser `npm run test:connection` dans le backend
4. **Dépannage** : Vérifier les logs dans les consoles

## 💡 **Avantages**

- ✅ **Automatisation** : Plus besoin de taper les commandes
- ✅ **Installation automatique** : Installe les dépendances
- ✅ **Gestion d'erreurs** : Messages clairs en cas de problème
- ✅ **Tests intégrés** : Vérification automatique du fonctionnement
