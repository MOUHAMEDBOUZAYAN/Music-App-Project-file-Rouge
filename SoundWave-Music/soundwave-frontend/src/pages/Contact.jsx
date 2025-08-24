import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send,
  Clock,
  Globe,
  Heart,
  ArrowLeft,
  Search,
  Home,
  Library,
  User,
  Settings
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Contact = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
    // Ici vous pouvez ajouter une notification de succès
    alert('Message envoyé avec succès!');
  };

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
                      <Link to="/about" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors rounded-lg mx-2">
                        <Globe className="h-4 w-4" />
                        <span>À propos</span>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        <div className="relative px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Contactez-nous
            </h1>
            <p className={`text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Nous sommes là pour vous aider. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 transition-all duration-300"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 transition-all duration-300"
                    placeholder="Sujet de votre message"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/30 transition-all duration-300 resize-none"
                    placeholder="Décrivez votre demande ou question..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-black rounded-lg px-6 py-3 font-semibold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white">
                Informations de contact
              </h2>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                    <p className="text-gray-300 mb-1">contact@soundwave.ma</p>
                    <p className="text-gray-400 text-sm">Support technique et questions générales</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Téléphone</h3>
                    <p className="text-gray-300 mb-1">+212 6 XX XX XX XX</p>
                    <p className="text-gray-400 text-sm">Lun-Ven: 9h-18h (GMT+1)</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Adresse</h3>
                    <p className="text-gray-300 mb-1">Casablanca, Maroc</p>
                    <p className="text-gray-400 text-sm">Siège social et bureaux principaux</p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Temps de réponse</h3>
                    <p className="text-gray-300 mb-1">24-48 heures</p>
                    <p className="text-gray-400 text-sm">Nous répondons à tous les messages</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Heart className="h-5 w-5 text-red-400 mr-2" />
                  Support 24/7
                </h3>
                <p className="text-gray-300 text-sm">
                  Notre équipe est disponible pour vous aider à tout moment. 
                  N'hésitez pas à nous contacter pour toute question ou assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-white transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              Questions fréquentes
            </h2>
            <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Trouvez rapidement des réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Comment puis-je signaler un bug ou un problème technique ?",
                answer: "Utilisez notre formulaire de contact en sélectionnant 'Problème technique' comme sujet. Notre équipe technique vous répondra dans les plus brefs délais."
              },
              {
                question: "Comment puis-je suggérer une nouvelle fonctionnalité ?",
                answer: "Nous adorons recevoir vos suggestions ! Envoyez-nous un message via le formulaire de contact avec 'Suggestion' comme sujet."
              },
              {
                question: "Quel est le délai de réponse pour les demandes commerciales ?",
                answer: "Pour les demandes commerciales et partenariats, nous répondons généralement dans les 24-48 heures ouvrables."
              },
              {
                question: "Puis-je contacter l'équipe pour des questions sur ma facturation ?",
                answer: "Oui, pour toute question relative à la facturation ou à votre abonnement, contactez-nous via email à billing@soundwave.ma"
              }
            ].map((faq, index) => (
              <div key={index} className={`bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transition-all duration-1000 delay-${(index + 1) * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
