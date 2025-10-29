import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { FaSpotify, FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
// import { useDeezer } from '../../store/DeezerContext'; // removed
import toast from 'react-hot-toast';
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
  AnimatedError,
  GentlePulse
} from '../common/SimpleAnimations';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  // const { loading: deezerLoading } = useDeezer(); // removed
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyLoading, setSpotifyLoading] = useState(false);

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

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
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
      const result = await authService.login(formData);
      
      if (result.success) {
        // Vérifier que les données nécessaires existent
        if (result.data && result.data.user && result.data.token) {
          const successMessage = result.data.message || 'Connexion réussie ! 🎉';
          toast.success(successMessage, {
            duration: 4000,
            icon: '🎵',
          });
          
          // Connexion réussie - passer tout l'objet result
          login(result);
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        } else {
          // Données manquantes dans la réponse
          console.error('Données manquantes dans la réponse:', result.data);
          toast.error('Erreur de connexion: données manquantes', {
            duration: 5000,
          });
          setErrors({ general: 'Erreur de connexion: données manquantes' });
        }
      } else {
        // Gestion améliorée des erreurs
        if (result.details && typeof result.details === 'object') {
          // Erreurs de validation du serveur
          const serverErrors = {};
          Object.keys(result.details).forEach(key => {
            if (key === 'email' || key === 'password') {
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
          setErrors({ general: result.error || 'La connexion a échoué. Veuillez réessayer.' });
          toast.error(result.error || 'La connexion a échoué. Veuillez réessayer.', {
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      // Gestion des erreurs réseau
      if (error.response && error.response.data) {
        const serverErrors = {};
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach(key => {
            if (key === 'email' || key === 'password') {
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

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

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
              <h1 className="text-4xl font-bold text-bemusic-primary mb-2">
                SoundWave
              </h1>
            </StaggerItem>
            <StaggerItem>
              <div className="w-16 h-1 bg-accent-bemusic mx-auto rounded-full"></div>
            </StaggerItem>
          </StaggerContainer>
          <StaggerItem delay={1}>
            <p className="text-bemusic-secondary text-lg max-w-sm leading-relaxed">
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

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <StaggerContainer className="w-full max-w-md">
          {/* Form Header */}
          <StaggerItem>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-bemusic-primary mb-2">
                Connexion
              </h2>
              <p className="text-bemusic-secondary">
                Accédez à votre bibliothèque musicale
              </p>
            </div>
          </StaggerItem>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <AnimatedError className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.general}</span>
              </AnimatedError>
            )}

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
                    className={`w-full pl-10 pr-4 py-4 bg-transparent border-b-2 rounded-none text-bemusic-primary placeholder-bemusic-tertiary transition-all duration-300 focus:outline-none ${
                      formData.email 
                        ? 'border-accent-bemusic' 
                        : 'border-bemusic-tertiary/30 hover:border-bemusic-secondary/50 focus:border-accent-bemusic'
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
                  className="block text-sm font-medium text-bemusic-secondary mb-2"
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
                    placeholder="Votre mot de passe"
                    className="w-full pl-10 pr-12 py-4 bg-transparent border-b-2 border-bemusic-tertiary/30 rounded-none text-bemusic-primary placeholder-bemusic-tertiary transition-all duration-300 hover:border-bemusic-secondary/50 focus:border-accent-bemusic focus:outline-none"
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
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.password}
                  </p>
                )}
              </div>
            </StaggerItem>

            {/* Submit Button */}
            <StaggerItem>
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-bemusic-primary py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-bemusic-primary disabled:opacity-50 disabled:cursor-not-allowed transition-bemusic shadow-lg hover:shadow-2xl hover:shadow-purple-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-bemusic-primary/30 border-t-bemusic-primary rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  'Se connecter'
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

            {/* Sign Up Link */}
            <StaggerItem>
              <div className="text-center">
                <p className="text-bemusic-tertiary text-sm">
                  Si vous n'avez pas de compte,{' '}
                  <button
                    type="button"
                    onClick={handleSwitchToRegister}
                    className="text-accent-bemusic hover:text-accent-bemusic/80 font-semibold transition-bemusic hover:underline hover:scale-105 inline-block"
                  >
                    inscrivez-vous
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

export default LoginForm; 