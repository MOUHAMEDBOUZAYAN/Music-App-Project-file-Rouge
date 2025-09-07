const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

// Fonction pour générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  console.log('📝 Données reçues pour l\'inscription:', req.body);
  
  const { firstName, LastName, email, password, confirmPassword, role } = req.body;
  
  // Créer le nom d'utilisateur à partir du prénom et nom
  const username = `${firstName} ${LastName}`.trim();

  try {
    // Validation des données
    if (!firstName || !LastName || !email || !password || !confirmPassword) {
      console.log('❌ Validation échouée - champs manquants');
      return res.status(400).json({ 
        success: false,
        message: 'Tous les champs sont requis',
        errors: {
          firstName: !firstName ? 'Le prénom est requis' : null,
          LastName: !LastName ? 'Le nom est requis' : null,
          email: !email ? 'L\'email est requis' : null,
          password: !password ? 'Le mot de passe est requis' : null,
          confirmPassword: !confirmPassword ? 'La confirmation du mot de passe est requise' : null
        }
      });
    }

    if (password !== confirmPassword) {
      console.log('❌ Validation échouée - mots de passe différents');
      return res.status(400).json({ 
        success: false,
        message: 'Les mots de passe ne correspondent pas',
        errors: {
          confirmPassword: 'Les mots de passe ne correspondent pas'
        }
      });
    }

    if (password.length < 6) {
      console.log('❌ Validation échouée - mot de passe trop court');
      return res.status(400).json({ 
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        errors: {
          password: 'Le mot de passe doit contenir au moins 6 caractères'
        }
      });
    }

    // Utiliser le nom d'utilisateur fourni
    // Déterminer le rôle basé sur role
    const userRole = role || 'listener';

    console.log('✅ Validation réussie, création de l\'utilisateur...');
    console.log('📋 Données utilisateur:', { username, email, role: userRole });

    // Vérifier si la base de données est disponible
    if (!User || !User.findOne) {
      console.log('⚠️  Mode simulation - base de données non disponible');
      
      // Mode simulation - créer un utilisateur temporaire
      const mockUser = {
        _id: Date.now().toString(),
        username,
        email,
        role,
        createdAt: new Date()
      };

      // Générer un token temporaire
      const token = jwt.sign({ id: mockUser._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
      });

      console.log('✅ Utilisateur simulé créé avec succès');
      
      return res.status(201).json({
        success: true,
        message: 'Compte créé avec succès !',
        user: {
          _id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role
        },
        token
      });
    }

    console.log('🗄️  Mode base de données - vérification de l\'existence...');
    
    // Mode normal avec base de données
    const userExists = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });

    if (userExists) {
      console.log('❌ Utilisateur existe déjà');
      
      // Déterminer quel champ est en conflit
      if (userExists.email === email.toLowerCase()) {
        return res.status(400).json({ 
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
          errors: {
            email: 'Cet email est déjà utilisé'
          }
        });
      } else {
        return res.status(400).json({ 
          success: false,
          message: 'Un utilisateur avec ce nom existe déjà',
          errors: {
            firstName: 'Ce nom d\'utilisateur est déjà pris',
            LastName: 'Ce nom d\'utilisateur est déjà pris'
          }
        });
      }
    }

    console.log('✅ Création de l\'utilisateur dans la base de données...');
    
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      role: userRole
    });

    if (user) {
      console.log('✅ Utilisateur créé avec succès dans la base de données');
      console.log('📤 Envoi de la réponse au frontend...');
      
      const responseData = {
        success: true,
        message: 'Compte créé avec succès !',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      };
      
      console.log('📋 Données de réponse:', responseData);
      
      return res.status(201).json(responseData);
    } else {
      console.log('❌ Échec de la création de l\'utilisateur');
      
      return res.status(400).json({ 
        success: false,
        message: 'Données utilisateur invalides',
        errors: {
          general: 'Impossible de créer le compte'
        }
      });
    }
  } catch (error) {
    console.error('💥 Erreur lors de l\'inscription:', error);
    
    // Gestion spécifique des erreurs MongoDB
    if (error.code === 11000) {
      // Erreur de clé dupliquée
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      
      if (field === 'email') {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà',
          errors: {
            email: 'Cet email est déjà utilisé'
          }
        });
      } else if (field === 'username') {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec ce nom existe déjà',
          errors: {
            firstName: 'Ce nom d\'utilisateur est déjà pris',
            LastName: 'Ce nom d\'utilisateur est déjà pris'
          }
        });
      }
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message 
    });
  }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  console.log('🔐 Tentative de connexion:', req.body);
  
  const { email, password } = req.body;

  try {
    // Validation des données
    if (!email || !password) {
      console.log('❌ Validation échouée - email ou mot de passe manquant');
      return res.status(400).json({ 
        success: false,
        message: 'Email et mot de passe requis',
        errors: {
          email: !email ? 'L\'email est requis' : null,
          password: !password ? 'Le mot de passe est requis' : null
        }
      });
    }

    // Vérifier si la base de données est disponible
    if (!User || !User.findOne) {
      console.log('⚠️  Mode simulation - base de données non disponible');
      
      // Mode simulation - vérification simple
      if (email === 'mohammedbouzi177@gmail.com' && password === 'Mouhamed12@') {
        const mockUser = {
          _id: 'mock-user-id',
          username: 'M.r Mohamed Bouzayan',
          email,
          role: 'listener'
        };

        const token = jwt.sign({ id: mockUser._id }, jwtConfig.secret, {
          expiresIn: jwtConfig.expiresIn
        });

        console.log('✅ Connexion simulée réussie');
        
        return res.json({
          success: true,
          message: 'Connexion réussie !',
          user: mockUser,
          token
        });
      } else {
        console.log('❌ Connexion simulée échouée - identifiants incorrects');
        
        return res.status(401).json({ 
          success: false,
          message: 'Email ou mot de passe incorrect',
          errors: {
            general: 'Email ou mot de passe incorrect'
          }
        });
      }
    }

    console.log('🗄️  Mode base de données - recherche de l\'utilisateur...');
    
    // Mode normal avec base de données
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      console.log('✅ Connexion réussie');
      
      return res.json({
        success: true,
        message: 'Connexion réussie !',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      console.log('❌ Connexion échouée - identifiants incorrects');
      
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect',
        errors: {
          general: 'Email ou mot de passe incorrect'
        }
      });
    }
  } catch (error) {
    console.error('💥 Erreur lors de la connexion:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la connexion',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
}; 