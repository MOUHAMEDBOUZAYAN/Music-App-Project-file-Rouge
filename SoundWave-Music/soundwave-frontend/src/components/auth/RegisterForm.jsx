import React, { useState } from 'react';
import { ArrowLeft, Search, MoreVertical, Mail, Lock, User, Music, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'listener'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const result = await authService.register(formData);
      
      if (result.success) {
        const successMessage = result.data?.message || 'Compte créé avec succès ! 🎉';
        toast.success(successMessage, {
          duration: 4000,
          icon: '🎵',
        });
        
        if (result.data.user && result.data.token) {
          login(result.data.user, result.data.token);
        }
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
        
        if (onRegister && result.data) {
          onRegister(result.data);
        }
      } else {
        toast.error(result.error || 'L\'inscription a échoué. Veuillez réessayer.', {
          duration: 5000,
        });
        
        if (result.details) {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
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
    <div className="min-h-screen bg-bemusic-primary flex">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-4">
          <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Left Panel - Branding and Visuals */}
      <div className="hidden lg:flex lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-bemusic-secondary to-bemusic-tertiary">
          {/* Background Image - Workspace */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
          </div>
        </div>
        
        {/* Logo and Tagline */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-bemusic-primary mb-2">
              SoundWave
            </h1>
            <div className="w-16 h-1 bg-accent-bemusic mx-auto rounded-full"></div>
          </div>
          <p className="text-bemusic-secondary text-lg max-w-sm leading-relaxed">
            Découvrez, créez et partagez votre passion pour la musique
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-bemusic-primary mb-2">
              Inscription
            </h2>
            <p className="text-bemusic-secondary">
              Créez votre compte et commencez votre voyage musical
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-bemusic-secondary mb-4">
                Je veux rejoindre en tant que :
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative group cursor-pointer transition-bemusic ${
                  formData.userType === 'listener' ? 'scale-105' : 'hover:scale-102'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="listener"
                    checked={formData.userType === 'listener'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-bemusic ${
                    formData.userType === 'listener'
                      ? 'border-accent-bemusic bg-accent-bemusic/20 shadow-lg shadow-accent-bemusic/25'
                      : 'border-bemusic-tertiary bg-bemusic-tertiary/20 hover:border-bemusic-secondary hover:bg-bemusic-secondary/20'
                  }`}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.userType === 'listener' ? 'bg-accent-bemusic' : 'bg-bemusic-tertiary'
                      }`}>
                        <User className="h-5 w-5 text-bemusic-primary" />
                      </div>
                      <span className="text-bemusic-primary font-medium">Auditeur</span>
                      <span className="text-xs text-bemusic-secondary text-center">Écoutez et découvrez de la musique</span>
                    </div>
                  </div>
                </label>
                
                <label className={`relative group cursor-pointer transition-bemusic ${
                  formData.userType === 'artist' ? 'scale-105' : 'hover:scale-102'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="artist"
                    checked={formData.userType === 'artist'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-bemusic ${
                    formData.userType === 'artist'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                      : 'border-bemusic-tertiary bg-bemusic-tertiary/20 hover:border-bemusic-secondary hover:bg-bemusic-secondary/20'
                  }`}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        formData.userType === 'artist' ? 'bg-purple-500' : 'bg-bemusic-tertiary'
                      }`}>
                        <Music className="h-5 w-5 text-bemusic-primary" />
                      </div>
                      <span className="text-bemusic-primary font-medium">Artiste</span>
                      <span className="text-xs text-bemusic-secondary text-center">Partagez votre musique</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-bemusic ${
                  formData.firstName ? 'text-accent-bemusic' : 'text-bemusic-secondary'
                }`}>
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className={`w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 transition-bemusic focus:outline-none ${
                    formData.firstName 
                      ? 'border-accent-bemusic' 
                      : 'border-bemusic-tertiary focus:border-bemusic-secondary'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-bemusic ${
                  formData.lastName ? 'text-accent-bemusic' : 'text-bemusic-secondary'
                }`}>
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className={`w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 transition-bemusic focus:outline-none ${
                    formData.lastName 
                      ? 'border-accent-bemusic' 
                      : 'border-bemusic-tertiary focus:border-bemusic-secondary'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-bemusic ${
                formData.email ? 'text-accent-bemusic' : 'text-bemusic-secondary'
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={`w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 transition-bemusic focus:outline-none ${
                  formData.email 
                    ? 'border-accent-bemusic' 
                    : 'border-bemusic-tertiary focus:border-bemusic-secondary'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-bemusic-secondary mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Créez un mot de passe"
                  className="w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 border-bemusic-tertiary focus:border-bemusic-secondary focus:outline-none transition-bemusic"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-bemusic-tertiary hover:text-bemusic-secondary transition-bemusic"
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
                          className={`h-1 flex-1 rounded-full transition-bemusic ${
                            level <= passwordStrength.strength
                              ? `bg-${passwordStrength.color}-500`
                              : 'bg-bemusic-tertiary'
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
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-bemusic-secondary mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  className="w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 border-bemusic-tertiary focus:border-bemusic-secondary focus:outline-none transition-bemusic"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-bemusic-tertiary hover:text-bemusic-secondary transition-bemusic"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-1 p-1 rounded-lg transition-bemusic ${
                  agreedToTerms 
                    ? 'bg-accent-bemusic text-bemusic-primary' 
                    : 'bg-bemusic-tertiary text-bemusic-secondary hover:bg-bemusic-secondary'
                }`}
              >
                {agreedToTerms ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4" />}
              </button>
              <div className="flex-1">
                <p className="text-sm text-bemusic-secondary leading-relaxed">
                  J'accepte les{' '}
                  <a href="#" className="text-accent-bemusic hover:text-accent-bemusic/80 font-medium transition-bemusic">
                    Conditions d'utilisation
                  </a>
                  {' '}et la{' '}
                  <a href="#" className="text-accent-bemusic hover:text-accent-bemusic/80 font-medium transition-bemusic">
                    Politique de confidentialité
                  </a>
                </p>
                {errors.terms && (
                  <p className="text-red-400 text-sm mt-1">{errors.terms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-bemusic-primary py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-bemusic-primary disabled:opacity-50 disabled:cursor-not-allowed transition-bemusic transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-bemusic-primary/30 border-t-bemusic-primary rounded-full animate-spin" />
                  <span>Création du compte...</span>
                </div>
              ) : (
                'S\'inscrire'
              )}
            </button>

            {/* Social Login Section */}
            <div className="text-center">
              <p className="text-bemusic-tertiary text-sm mb-4">
                Inscription rapide avec vos réseaux sociaux
              </p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-blue-600 transition-bemusic">
                  <span className="font-bold text-sm">f</span>
                </button>
                <button className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-blue-500 transition-bemusic">
                  <span className="font-bold text-sm">t</span>
                </button>
                <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-red-600 transition-bemusic">
                  <span className="font-bold text-sm">g+</span>
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-bemusic-tertiary text-sm">
                Si vous avez déjà un compte,{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-accent-bemusic hover:text-accent-bemusic/80 font-semibold transition-bemusic"
                >
                  connectez-vous
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