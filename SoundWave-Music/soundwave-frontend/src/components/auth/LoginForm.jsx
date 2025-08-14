import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        toast.success('Connexion réussie ! 🎉', {
          duration: 3000,
          icon: '🎵',
        });
        
        login(result.data.user, result.data.token);
        
        const redirectTo = location.state?.redirectTo || '/';
        navigate(redirectTo, { replace: true });
      } else {
        toast.error(result.error || 'Email ou mot de passe incorrect', {
          duration: 5000,
        });
        
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.', {
        duration: 5000,
      });
      
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-bemusic-primary flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-bemusic/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110 hover:rotate-12"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-4">
          <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-bemusic-primary hover:text-accent-bemusic transition-bemusic hover:scale-110">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Floating Navigation Card */}
      <div className="absolute top-20 right-6 z-20 animate-bounce">
        <div className="bg-bemusic-secondary/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-bemusic-primary/20 hover:scale-105 transition-all duration-300 transform hover:rotate-1">
          <div className="text-center">
            <p className="text-bemusic-secondary text-sm mb-2">Nouveau sur SoundWave ?</p>
            <button
              onClick={handleSwitchToRegister}
              className="bg-gradient-to-r from-accent-bemusic to-purple-600 text-bemusic-primary px-6 py-2 rounded-xl font-semibold hover:from-accent-bemusic/90 hover:to-purple-600/90 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-2 mx-auto group"
            >
              <span>S'inscrire</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
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
          <div className="mb-8 animate-pulse">
            <h1 className="text-4xl font-bold text-bemusic-primary mb-2">
              SoundWave
            </h1>
            <div className="w-16 h-1 bg-accent-bemusic mx-auto rounded-full animate-pulse"></div>
          </div>
          <p className="text-bemusic-secondary text-lg max-w-sm leading-relaxed">
            Découvrez, créez et partagez votre passion pour la musique
          </p>
          
          {/* Floating Music Notes */}
          <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '1s'}}>
            <div className="text-accent-bemusic text-2xl">♪</div>
          </div>
          <div className="absolute bottom-20 right-10 animate-bounce" style={{animationDelay: '2s'}}>
            <div className="text-purple-500 text-2xl">♫</div>
          </div>
          <div className="absolute top-1/2 left-5 animate-bounce" style={{animationDelay: '3s'}}>
            <div className="text-blue-500 text-xl">♩</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-bemusic-primary mb-2 animate-pulse">
              Connexion
            </h2>
            <p className="text-bemusic-secondary">
              Accédez à votre bibliothèque musicale
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2 animate-pulse">
                <AlertCircle className="h-5 w-5" />
                <span>{errors.general}</span>
              </div>
            )}

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
                className={`w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 transition-bemusic focus:outline-none hover:scale-105 ${
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
                  placeholder="Votre mot de passe"
                  className="w-full bg-transparent text-bemusic-primary placeholder-bemusic-tertiary py-3 px-0 border-b-2 border-bemusic-tertiary focus:border-bemusic-secondary focus:outline-none transition-bemusic hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-bemusic-tertiary hover:text-bemusic-secondary transition-bemusic hover:scale-110"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-bemusic-primary py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-bemusic-primary disabled:opacity-50 disabled:cursor-not-allowed transition-bemusic transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-bemusic-primary/30 border-t-bemusic-primary rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Social Login Section */}
            <div className="text-center">
              <p className="text-bemusic-tertiary text-sm mb-4">
                Connexion rapide avec vos réseaux sociaux
              </p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-blue-600 transition-bemusic hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-blue-500/50">
                  <span className="font-bold text-sm">f</span>
                </button>
                <button className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-blue-500 transition-bemusic hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-blue-400/50">
                  <span className="font-bold text-sm">t</span>
                </button>
                <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-bemusic-primary hover:bg-red-600 transition-bemusic hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-red-500/50">
                  <span className="font-bold text-sm">g+</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 