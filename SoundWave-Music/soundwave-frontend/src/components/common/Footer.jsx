import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Linkedin,
  Facebook, 
  Globe,
  Heart,
  Play,
  Music,
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800/50 mb-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Section principale avec grille 4 colonnes - Style Spotify */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* SoundWave - Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-white text-2xl font-bold">SoundWave</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Découvrez, écoutez et partagez la musique que vous aimez. 
              Rejoignez des millions d'auditeurs à travers le monde.
            </p>
            
            {/* Réseaux sociaux avec design moderne */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Produits</h3>
            <div className="space-y-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>SoundWave Free</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>SoundWave Premium</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>SoundWave Family</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>SoundWave Student</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>SoundWave Duo</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Entreprise</h3>
            <div className="space-y-3">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>À propos</span>
                <ChevronRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Offres d'emploi</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Pour les marques</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Presse</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Investisseurs</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Communautés */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Communautés</h3>
            <div className="space-y-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Pour les artistes</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Développeurs</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Publicité</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Investisseurs</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                <span>Fournisseurs</span>
                <ExternalLink className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Section contact et informations - Style professionnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 text-green-400 mr-2" />
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <span>contact@soundwave.ma</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+212 6 90 81 56 05</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Beni Mellal, Maroc</span>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 text-blue-400 mr-2" />
              Statistiques
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Utilisateurs actifs</span>
                <span className="font-semibold text-white">2.5M+</span>
              </div>
              <div className="flex justify-between">
                <span>Pays couverts</span>
                <span className="font-semibold text-white">45+</span>
              </div>
              <div className="flex justify-between">
                <span>Artistes</span>
                <span className="font-semibold text-white">100K+</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Music className="h-5 w-5 text-purple-400 mr-2" />
              Support
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <a href="#" className="block hover:text-white transition-colors">Centre d'aide</a>
              <a href="#" className="block hover:text-white transition-colors">Communauté</a>
              <a href="#" className="block hover:text-white transition-colors">Statut du service</a>
              <a href="#" className="block hover:text-white transition-colors">Contact support</a>
            </div>
          </div>
        </div>

        {/* Section finale avec liens légaux et copyright */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white cursor-pointer transition-colors">Légal</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors">Cookies</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors">Aide</a>
              <a href="#" className="hover:text-white cursor-pointer transition-colors">Accessibilité</a>
            </div>
            
            {/* Sélecteur de langue et copyright */}
            <div className="flex items-center space-x-6">
              {/* Sélecteur de langue */}
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Maroc (français)</span>
              </div>
              
              {/* Copyright avec logo */}
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-gray-400 text-sm">© {currentYear} SoundWave AB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
