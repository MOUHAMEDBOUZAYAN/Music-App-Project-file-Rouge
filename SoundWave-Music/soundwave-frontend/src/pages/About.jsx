import React, { useEffect, useState } from 'react';
import { 
  Music, 
  Users, 
  Globe, 
  Heart, 
  Award, 
  Zap,
  Play,
  Headphones,
  Radio,
  Mic,
  Disc3,
  Star,
  ArrowLeft,
  Search,
  Home,
  Library,
  User,
  Settings
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const About = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  // Image de Mohamed depuis les variables d'environnement
  const mohamedImage = import.meta.env.VITE_MOHAMED_IMAGE_URL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setAnimateStats(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full Header with Navigation */}
      <header className={`bg-black border-b border-gray-800/50 py-4 px-6 sticky top-0 z-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105 mr-4"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              
              <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
                SoundWave
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Accueil</span>
                </Link>
                <Link to="/search" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Recherche</span>
                </Link>
                <Link to="/library" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Library className="h-4 w-4" />
                  <span>Bibliothèque</span>
                </Link>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-all duration-200 hover:bg-green-400 text-sm">
                Découverte Premium
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-black">
                      {user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="text-sm font-medium text-white">
                        {user?.username || 'Utilisateur'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user?.email || 'email@example.com'}
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link to="/profile" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg mx-2">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                      <Link to="/settings" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg mx-2">
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-700/50 pt-1">
                      <button 
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg mx-2"
                      >
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Floating Animation */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        <div className="relative px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <Music className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              À propos de SoundWave
            </h1>
            <p className={`text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Découvrez l'histoire derrière la plateforme qui révolutionne l'écoute de musique au Maroc et au-delà
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Mission Section with Slide Animation */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Chez SoundWave, nous croyons que la musique est un langage universel qui unit les gens. 
                Notre mission est de créer une plateforme accessible, intuitive et riche en contenu pour 
                tous les amoureux de musique au Maroc et dans le monde.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Nous nous engageons à soutenir les artistes locaux, à promouvoir la diversité culturelle 
                et à offrir une expérience d'écoute exceptionnelle à nos utilisateurs.
              </p>
            </div>
            <div className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="w-full h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 flex items-center justify-center hover:scale-105 transition-transform duration-500">
                <div className="text-center">
                  <Users className="h-16 w-16 text-green-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white mb-2">Communauté</h3>
                  <p className="text-gray-300">Plus de 100,000 utilisateurs actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Stagger Animation */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-white transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              Pourquoi Choisir SoundWave ?
            </h2>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Découvrez les fonctionnalités qui font de SoundWave la plateforme de choix pour la musique
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:rotate-1 transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Headphones className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Qualité Audio Premium</h3>
              <p className="text-gray-300">
                Profitez d'une qualité audio exceptionnelle avec nos formats haute définition et nos algorithmes d'optimisation avancés.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:-rotate-1 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Radio className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Radio Intelligente</h3>
              <p className="text-gray-300">
                Découvrez de nouvelles musiques grâce à nos algorithmes de recommandation basés sur l'intelligence artificielle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:rotate-1 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Mic className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Artistes Locaux</h3>
              <p className="text-gray-300">
                Soutenez et découvrez les talents locaux du Maroc et d'Afrique du Nord sur notre plateforme.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:-rotate-1 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Disc3 className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bibliothèque Complète</h3>
              <p className="text-gray-300">
                Accédez à des millions de titres, albums et playlists de tous genres et de toutes époques.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:rotate-1 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Heart className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personnalisation</h3>
              <p className="text-gray-300">
                Créez vos propres playlists et recevez des recommandations personnalisées selon vos goûts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:-rotate-1 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <Zap className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Performance</h3>
              <p className="text-gray-300">
                Interface ultra-rapide et synchronisation en temps réel sur tous vos appareils.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Count Animation */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center transition-all duration-1000 delay-100 ${
              animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-400">Utilisateurs actifs</div>
            </div>

            <div className={`text-center transition-all duration-1000 delay-200 ${
              animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '0.2s'}}>
                <Music className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">50M+</div>
              <div className="text-gray-400">Titres disponibles</div>
            </div>

            <div className={`text-center transition-all duration-1000 delay-300 ${
              animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '0.4s'}}>
                <Mic className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Artistes locaux</div>
            </div>

            <div className={`text-center transition-all duration-1000 delay-400 ${
              animateStats ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '0.6s'}}>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-gray-400">Note utilisateurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Single Member */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-white transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              Notre Équipe
            </h2>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Un passionné de musique et de technologie qui travaille seul pour créer la meilleure expérience possible
            </p>
          </div>

          <div className="flex justify-center">
            <div className={`text-center transition-all duration-1000 delay-700 hover:scale-105 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse overflow-hidden">
                <img 
                  src={mohamedImage} 
                  alt="Mohamed Bouzayan" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Mohamed Bouzayan</h3>
              <p className="text-gray-400 text-lg">Fondateur & Développeur Full-Stack</p>
              <p className="text-gray-500 text-sm mt-2">Passionné de musique et de technologie</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Floating Animation */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 animate-pulse"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-white transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            Prêt à Découvrir SoundWave ?
          </h2>
          <p className={`text-xl text-gray-300 mb-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Rejoignez notre communauté et commencez votre voyage musical dès aujourd'hui
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <button className="px-8 py-4 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-all duration-200 hover:bg-green-400 shadow-lg hover:shadow-green-500/25 text-lg animate-pulse">
              Commencer Gratuitement
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-200 text-lg hover:scale-105">
              En savoir plus
            </button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-20 w-6 h-6 bg-green-400 rounded-full animate-bounce opacity-75"></div>
        <div className="absolute bottom-10 right-20 w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-75" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-75" style={{animationDelay: '1s'}}></div>
      </section>
    </div>
  );
};

export default About;
