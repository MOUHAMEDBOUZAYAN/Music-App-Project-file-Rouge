import React, { useState } from 'react';
import { ArrowLeft, Search, MoreVertical, Mail, Lock, User, Music, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { FaSpotify, FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  AnimatedPage, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedButton, 
  AnimatedBackground, 
  AnimatedMusicNote, 
  AnimatedIcon,
  AnimatedInput,
  AnimatedLabel,
  AnimatedError
} from '../common/SimpleAnimations';

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
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // const { loading: deezerLoading } = useDeezer(); // removed

  // Fonction pour la connexion Spotify
  const spotifyLogin = async () => {
    try {
      setSpotifyLoading(true);
      // Rediriger vers la route d'authentification Spotify du backend
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const spotifyAuthUrl = `${backendUrl}/api/auth/spotify/login`;
      window.location.href = spotifyAuthUrl;
    } catch (error) {
      console.error('Erreur lors de la connexion Spotify:', error);
      toast.error('Erreur lors de la connexion Spotify');
    } finally {
      setSpotifyLoading(false);
    }
  };

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
        // Vérifier que les données nécessaires existent
        if (result.data && result.data.user && result.data.token) {
          const successMessage = result.data.message || 'Compte créé avec succès ! 🎉';
          toast.success(successMessage, {
            duration: 4000,
            icon: '🎵',
          });
          
          // Inscription réussie - passer tout l'objet result
          login(result);
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          // Données manquantes dans la réponse
          console.error('Données manquantes dans la réponse:', result.data);
          toast.error('Erreur d\'inscription: données manquantes', {
            duration: 5000,
          });
          setErrors({ general: 'Erreur d\'inscription: données manquantes' });
        }
      } else {
        // Gestion améliorée des erreurs
        if (result.details && typeof result.details === 'object') {
          // Erreurs de validation du serveur
          const serverErrors = {};
          Object.keys(result.details).forEach(key => {
            if (key === 'firstName' || key === 'lastName' || key === 'email' || key === 'password' || key === 'confirmPassword') {
              serverErrors[key] = result.details[key];
            }
          });
          setErrors(serverErrors);
          
          // Afficher le message d'erreur principal
          toast.error(result.error || 'Veuillez corriger les erreurs dans le formulaire', {
            duration: 5000,
          });
        } else {
          // Erreur générale
          setErrors({ general: result.error || 'L\'inscription a échoué. Veuillez réessayer.' });
          toast.error(result.error || 'L\'inscription a échoué. Veuillez réessayer.', {
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion des erreurs réseau
      if (error.response && error.response.data) {
        const serverErrors = {};
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach(key => {
            if (key === 'firstName' || key === 'lastName' || key === 'email' || key === 'password' || key === 'confirmPassword') {
              serverErrors[key] = error.response.data.errors[key];
            }
          });
          setErrors(serverErrors);
        }
        
        toast.error(error.response.data.message || 'Erreur de validation', {
          duration: 5000,
        });
      } else {
        setErrors({ general: 'Erreur de connexion. Vérifiez votre connexion internet.' });
        toast.error('Erreur de connexion. Vérifiez votre connexion internet.', {
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
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
    <AnimatedPage className="min-h-screen bg-bemusic-primary flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedBackground 
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent-bemusic/10 rounded-full blur-3xl"
          delay={0}
        />
        <AnimatedBackground 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          delay={2}
        />
        <AnimatedBackground 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          delay={4}
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
        <AnimatedIcon delay={0}>
          <button 
            onClick={() => navigate(-1)}
            className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110 hover:rotate-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </AnimatedIcon>
        <div className="flex items-center space-x-4">
          <AnimatedIcon delay={0.5}>
            <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110">
              <Search className="h-5 w-5" />
            </button>
          </AnimatedIcon>
          <AnimatedIcon delay={1}>
            <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110">
              <MoreVertical className="h-5 w-5" />
            </button>
          </AnimatedIcon>
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
          <StaggerContainer className="mb-8">
            <StaggerItem>
              <h1 className="text-4xl font-bold text-white mb-2">
                SoundWave
              </h1>
            </StaggerItem>
            <StaggerItem>
              <div className="w-16 h-1 bg-accent-bemusic mx-auto rounded-full"></div>
            </StaggerItem>
          </StaggerContainer>
          <StaggerItem delay={1}>
            <p className="text-gray-300 text-lg max-w-sm leading-relaxed">
              Découvrez, créez et partagez votre passion pour la musique
            </p>
          </StaggerItem>
          
          {/* Floating Music Notes */}
          <AnimatedMusicNote 
            className="absolute top-20 left-10"
            delay={2}
          >
            <div className="text-accent-bemusic text-2xl">♪</div>
          </AnimatedMusicNote>
          <AnimatedMusicNote 
            className="absolute bottom-20 right-10"
            delay={3}
          >
            <div className="text-purple-500 text-2xl">♫</div>
          </AnimatedMusicNote>
          <AnimatedMusicNote 
            className="absolute top-1/2 left-5"
            delay={4}
          >
            <div className="text-blue-500 text-xl">♩</div>
          </AnimatedMusicNote>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <StaggerContainer className="w-full max-w-md">
          {/* Form Header */}
          <StaggerItem>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Inscription
              </h2>
              <p className="text-gray-400">
                Créez votre compte et commencez votre voyage musical
              </p>
            </div>
          </StaggerItem>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <AnimatedError className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.general}</span>
              </AnimatedError>
            )}

            {/* User Type Selection */}
            <StaggerItem>
              <div>
                <AnimatedLabel 
                  className="block text-sm font-medium text-gray-300 mb-4"
                  isActive={false}
                >
                  Je veux rejoindre en tant que :
                </AnimatedLabel>
                                 <div className="grid grid-cols-2 gap-3">
                   <label className={`relative cursor-pointer transition-all duration-300 ${
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
                     <div className={`h-24 rounded-none border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                       formData.userType === 'listener'
                         ? 'border-accent-bemusic bg-accent-bemusic/20 shadow-lg'
                         : 'border-bemusic-tertiary/30 bg-bemusic-tertiary/10 hover:border-bemusic-secondary/50 hover:bg-bemusic-secondary/20'
                     }`}>
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                         formData.userType === 'listener' 
                           ? 'bg-accent-bemusic shadow-lg' 
                           : 'bg-bemusic-tertiary/30'
                       }`}>
                         <User className={`h-6 w-6 transition-all duration-300 ${
                           formData.userType === 'listener' ? 'text-white' : 'text-bemusic-secondary'
                         }`} />
                       </div>
                       <span className={`font-semibold text-sm transition-all duration-300 ${
                         formData.userType === 'listener' ? 'text-green-400' : 'text-white'
                       }`}>
                         Auditeur
                       </span>
                     </div>
                   </label>
                   
                   <label className={`relative cursor-pointer transition-all duration-300 ${
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
                     <div className={`h-24 rounded-none border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                       formData.userType === 'artist'
                         ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                         : 'border-bemusic-tertiary/30 bg-bemusic-tertiary/10 hover:border-bemusic-secondary/50 hover:bg-bemusic-secondary/20'
                     }`}>
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                         formData.userType === 'artist' 
                           ? 'bg-purple-500 shadow-lg' 
                           : 'bg-bemusic-tertiary/30'
                       }`}>
                         <Music className={`h-6 w-6 transition-all duration-300 ${
                           formData.userType === 'artist' ? 'text-white' : 'text-bemusic-secondary'
                         }`} />
                       </div>
                       <span className={`font-semibold text-sm transition-all duration-300 ${
                         formData.userType === 'artist' ? 'text-purple-400' : 'text-white'
                       }`}>
                         Artiste
                       </span>
                     </div>
                   </label>
                 </div>
              </div>
            </StaggerItem>

            {/* Name Fields */}
            <StaggerItem>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AnimatedLabel 
                    className="block text-sm font-medium text-bemusic-secondary mb-2 transition-bemusic"
                    isActive={formData.firstName}
                  >
                    Prénom
                  </AnimatedLabel>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-bemusic-tertiary group-focus-within:text-accent-bemusic transition-colors duration-200" />
                    </div>
                    <AnimatedInput
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      style={{ color: 'white' }}
                      className={`w-full pl-10 pr-4 py-4 bg-transparent border-b-2 rounded-none !text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
                        formData.firstName 
                          ? 'border-green-500' 
                          : 'border-gray-600 hover:border-gray-500 focus:border-green-500'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-bemusic transition-all duration-300 group-focus-within:w-full"></div>
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <AnimatedLabel 
                    className="block text-sm font-medium text-bemusic-secondary mb-2 transition-bemusic"
                    isActive={formData.lastName}
                  >
                    Nom
                  </AnimatedLabel>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-bemusic-tertiary group-focus-within:text-accent-bemusic transition-colors duration-200" />
                    </div>
                    <AnimatedInput
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      style={{ color: 'white' }}
                      className={`w-full pl-10 pr-4 py-4 bg-transparent border-b-2 rounded-none !text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
                        formData.lastName 
                          ? 'border-green-500' 
                          : 'border-gray-600 hover:border-gray-500 focus:border-green-500'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-bemusic transition-all duration-300 group-focus-within:w-full"></div>
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>

            {/* Email Field */}
            <StaggerItem>
              <div>
                <AnimatedLabel 
                  className="block text-sm font-medium text-bemusic-secondary mb-2 transition-bemusic"
                  isActive={formData.email}
                >
                  Email
                </AnimatedLabel>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-bemusic-tertiary group-focus-within:text-accent-bemusic transition-colors duration-200" />
                  </div>
                  <AnimatedInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    style={{ color: 'white' }}
                    className={`w-full pl-10 pr-4 py-4 bg-transparent border-b-2 rounded-none !text-white placeholder-gray-500 transition-all duration-300 focus:outline-none ${
                      formData.email 
                        ? 'border-green-500' 
                        : 'border-gray-600 hover:border-gray-500 focus:border-green-500'
                    }`}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-bemusic transition-all duration-300 group-focus-within:w-full"></div>
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.email}
                  </p>
                )}
              </div>
            </StaggerItem>

            {/* Password Field */}
            <StaggerItem>
              <div>
                <AnimatedLabel 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  isActive={false}
                >
                  Mot de passe
                </AnimatedLabel>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-bemusic-tertiary group-focus-within:text-accent-bemusic transition-colors duration-200" />
                  </div>
                  <AnimatedInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Créez un mot de passe"
                    style={{ color: 'white' }}
                    className="w-full pl-10 pr-12 py-4 bg-transparent border-b-2 border-gray-600 rounded-none !text-white placeholder-gray-500 transition-all duration-300 hover:border-gray-500 focus:border-green-500 focus:outline-none"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-bemusic transition-all duration-300 group-focus-within:w-full"></div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-bemusic-tertiary hover:text-bemusic-secondary hover:bg-bemusic-secondary/10 rounded-lg transition-all duration-200 hover:scale-110"
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
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.password}
                  </p>
                )}
              </div>
            </StaggerItem>

            {/* Confirm Password Field */}
            <StaggerItem>
              <div>
                <AnimatedLabel 
                  className="block text-sm font-medium text-gray-300 mb-2"
                  isActive={false}
                >
                  Confirmer le mot de passe
                </AnimatedLabel>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-bemusic-tertiary group-focus-within:text-accent-bemusic transition-colors duration-200" />
                  </div>
                  <AnimatedInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                    style={{ color: 'white' }}
                    className="w-full pl-10 pr-12 py-4 bg-transparent border-b-2 border-gray-600 rounded-none !text-white placeholder-gray-500 transition-all duration-300 hover:border-gray-500 focus:border-green-500 focus:outline-none"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-bemusic transition-all duration-300 group-focus-within:w-full"></div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-bemusic-tertiary hover:text-bemusic-secondary hover:bg-bemusic-secondary/10 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </StaggerItem>

            {/* Terms and Conditions */}
            <StaggerItem>
              <div className="flex items-start space-x-3">
                <AnimatedIcon delay={0}>
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
                </AnimatedIcon>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    J'accepte les{' '}
                    <a href="#" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                      Conditions d'utilisation
                    </a>
                    {' '}et la{' '}
                    <a href="#" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                      Politique de confidentialité
                    </a>
                  </p>
                  {errors.terms && (
                    <p className="text-red-400 text-sm mt-1">{errors.terms}</p>
                  )}
                </div>
              </div>
            </StaggerItem>

            {/* Submit Button */}
            <StaggerItem>
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl hover:shadow-purple-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-bemusic-primary/30 border-t-bemusic-primary rounded-full animate-spin" />
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  'S\'inscrire'
                )}
              </AnimatedButton>
            </StaggerItem>

            {/* Social Login Section */}
            <StaggerItem>
              <div>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Or continue with
                </p>
                <div className="flex justify-center space-x-3">
                  <AnimatedButton
                    className="bg-white border border-gray-300 rounded-none px-4 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaGoogle className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-700 font-medium">Google</span>
                  </AnimatedButton>
                  <AnimatedButton
                    className="bg-white border border-gray-300 rounded-none px-4 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="w-5 h-5 bg-gray-700 rounded-none flex items-center justify-center">
                      <FaFacebook className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Facebook</span>
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={spotifyLogin}
                    disabled={spotifyLoading}
                    className="bg-white border border-gray-300 rounded-none px-4 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {spotifyLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaSpotify className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 font-medium">Spotify</span>
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </StaggerItem>

            {/* Sign In Link */}
            <StaggerItem>
              <div>
                <p className="text-gray-400 text-sm">
                  Si vous avez déjà un compte,{' '}
                  <button
                    type="button"
                    onClick={handleSwitchToLogin}
                    className="text-green-400 hover:text-green-300 font-semibold transition-colors hover:underline hover:scale-105 inline-block"
                  >
                    connectez-vous
                  </button>
                </p>
              </div>
            </StaggerItem>
          </form>
        </StaggerContainer>
      </div>
    </AnimatedPage>
  );
};

export default RegisterForm; 