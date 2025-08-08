import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Music, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'listener' // 'listener' or 'artist'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom de famille est requis';
    }

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir majuscule, minuscule et chiffre';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('Registering with:', formData);
      
      // Appel à l'API d'inscription
      const result = await authService.register(formData);
      
      if (result.success) {
        console.log('Inscription réussie:', result.data);
        
        // Afficher un toast de succès
        toast.success(result.data.message || 'Compte créé avec succès ! 🎉', {
          duration: 4000,
          icon: '🎵',
        });
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        
        // Appeler le callback si fourni
        if (onRegister) {
          onRegister(result.data);
        }
      } else {
        console.error('Erreur d\'inscription:', result.error);
        
        // Afficher un toast d'erreur
        toast.error(result.error || 'L\'inscription a échoué. Veuillez réessayer.', {
          duration: 5000,
        });
        
        // Afficher les erreurs spécifiques si disponibles
        if (result.details) {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Afficher un toast d'erreur
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.', {
        duration: 5000,
      });
      
      setErrors({ general: 'L\'inscription a échoué. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'gray', text: '' };
    if (password.length < 8) return { strength: 1, color: 'red', text: 'Faible' };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 3, color: 'green', text: 'Fort' };
    }
    return { strength: 2, color: 'yellow', text: 'Moyen' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Rejoignez SoundWave
          </h2>
          <p className="text-gray-300 text-lg">Commencez votre voyage musical</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-4">
                Je veux rejoindre en tant que :
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative group cursor-pointer transition-all duration-300 ${
                  formData.userType === 'listener'
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="listener"
                    checked={formData.userType === 'listener'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.userType === 'listener'
                      ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-blue-600/20 shadow-lg shadow-blue-500/25'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.userType === 'listener' ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-medium">Auditeur</span>
                      <span className="text-xs text-gray-400 text-center">Écoutez et découvrez de la musique</span>
                    </div>
                  </div>
                </label>
                
                <label className={`relative group cursor-pointer transition-all duration-300 ${
                  formData.userType === 'artist'
                    ? 'scale-105'
                    : 'hover:scale-102'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="artist"
                    checked={formData.userType === 'artist'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.userType === 'artist'
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-purple-600/20 shadow-lg shadow-purple-500/25'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.userType === 'artist' ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <Music className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-medium">Artiste</span>
                      <span className="text-xs text-gray-400 text-center">Partagez votre musique</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Prénom
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className={`w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all duration-300 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={`w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all duration-300 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Adresse Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={`w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all duration-300 border ${
                    errors.email ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Créez un mot de passe"
                  className={`w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all duration-300 border ${
                    errors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? `bg-${passwordStrength.color}-500`
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-400' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  className={`w-full bg-gray-800/50 text-white placeholder-gray-400 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700/50 transition-all duration-300 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-1 p-1 rounded-lg transition-all duration-300 ${
                  agreedToTerms 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {agreedToTerms ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4" />}
              </button>
              <div className="flex-1">
                <p className="text-sm text-gray-300 leading-relaxed">
                  J'accepte les{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Conditions d'utilisation
                  </a>
                  {' '}et la{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Politique de confidentialité
                  </a>
                </p>
                {errors.terms && (
                  <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.terms}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Création du compte...</span>
                </div>
              ) : (
                'Créer mon compte'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-300">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 