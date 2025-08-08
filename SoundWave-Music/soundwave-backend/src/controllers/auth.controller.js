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
  const { firstName, lastName, email, password, confirmPassword, userType } = req.body;

  try {
    // Validation des données
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis',
        errors: {
          firstName: !firstName ? 'Le prénom est requis' : null,
          lastName: !lastName ? 'Le nom est requis' : null,
          email: !email ? 'L\'email est requis' : null,
          password: !password ? 'Le mot de passe est requis' : null,
          confirmPassword: !confirmPassword ? 'La confirmation du mot de passe est requise' : null
        }
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Les mots de passe ne correspondent pas',
        errors: {
          confirmPassword: 'Les mots de passe ne correspondent pas'
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        errors: {
          password: 'Le mot de passe doit contenir au moins 6 caractères'
        }
      });
    }

    // Créer le nom d'utilisateur à partir du prénom et nom
    const username = `${firstName} ${lastName}`.trim();
    
    // Déterminer le rôle basé sur userType
    const role = userType === 'artist' ? 'artist' : 'listener';

    // Vérifier si la base de données est disponible
    if (!User || !User.findOne) {
      // Mode simulation - créer un utilisateur temporaire
      const mockUser = {
        _id: Date.now().toString(),
        username,
        email,
        role,
        createdAt: new Date()
      };

      // Générer un token temporaire
      const token = jwt.sign({ id: mockUser._id }, 'temp-secret-key', {
        expiresIn: '7d'
      });

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

    // Mode normal avec base de données
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email existe déjà',
        errors: {
          email: 'Cet email est déjà utilisé'
        }
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès !',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ 
        message: 'Données utilisateur invalides',
        errors: {
          general: 'Impossible de créer le compte'
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message 
    });
  }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation des données
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email et mot de passe requis',
        errors: {
          email: !email ? 'L\'email est requis' : null,
          password: !password ? 'Le mot de passe est requis' : null
        }
      });
    }

    // Vérifier si la base de données est disponible
    if (!User || !User.findOne) {
      // Mode simulation - vérification simple
      if (email === 'mohammedbouzi177@gmail.com' && password === 'Mouhamed12@') {
        const mockUser = {
          _id: 'mock-user-id',
          username: 'M.r Mohamed Bouzayan',
          email,
          role: 'listener'
        };

        const token = jwt.sign({ id: mockUser._id }, 'temp-secret-key', {
          expiresIn: '7d'
        });

        return res.json({
          success: true,
          message: 'Connexion réussie !',
          user: mockUser,
          token
        });
      } else {
        return res.status(401).json({ 
          message: 'Email ou mot de passe incorrect',
          errors: {
            general: 'Email ou mot de passe incorrect'
          }
        });
      }
    }

    // Mode normal avec base de données
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
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
      res.status(401).json({ 
        message: 'Email ou mot de passe incorrect',
        errors: {
          general: 'Email ou mot de passe incorrect'
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la connexion',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
}; 