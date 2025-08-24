import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Globe,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800 pb-32">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Logo et liens principaux */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Logo SoundWave */}
          <div className="xs:col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">SoundWave</h2>
              <p className="text-gray-400 text-xs xs:text-sm mt-2 leading-relaxed">
                Découvrez, écoutez et partagez votre musique
              </p>
            </div>
            
            {/* Icônes réseaux sociaux */}
            <div className="flex space-x-2 xs:space-x-3 sm:space-x-4">
              <a 
                href="#" 
                className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-950 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
              </a>
            </div>
          </div>

          {/* SOCIÉTÉ */}
          <div className="xs:col-span-1 sm:col-span-1">
            <h3 className="text-xs xs:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 xs:mb-3 sm:mb-4">
              Société
            </h3>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Offres d'emploi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  For the Record
                </a>
              </li>
            </ul>
          </div>

          {/* COMMUNAUTÉS */}
          <div className="xs:col-span-1 sm:col-span-1">
            <h3 className="text-xs xs:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 xs:mb-3 sm:mb-4">
              Communautés
            </h3>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Espace artistes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Développeurs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Campagnes publicitaires
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Investisseurs
                </a>
              </li>
            </ul>
          </div>

          {/* LIENS UTILES */}
          <div className="xs:col-span-1 sm:col-span-1">
            <h3 className="text-xs xs:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 xs:mb-3 sm:mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Assistance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Lecteur Web
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Appli mobile gratuite
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Importer votre musique
                </a>
              </li>
            </ul>
          </div>

          {/* ABONNEMENTS */}
          <div className="xs:col-span-1 sm:col-span-1">
            <h3 className="text-xs xs:text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2 xs:mb-3 sm:mb-4">
              Abonnements
            </h3>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Premium Personnel
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Premium Duo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Premium Famille
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-700 transition-colors text-xs xs:text-sm">
                  Premium Étudiants
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 pt-4 xs:pt-5 sm:pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 xs:space-y-4 lg:space-y-0">
            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Légal
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Centre de sécurité et de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Protection des données
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                À propos des pubs
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Accessibilité
              </a>
            </div>

            {/* Sélecteur de langue et copyright */}
            <div className="flex flex-col items-center lg:items-end space-y-2 text-center lg:text-right">
              {/* Sélecteur de langue */}
              <div className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Globe className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                <span className="text-xs xs:text-sm">Maroc (français)</span>
              </div>
              
              {/* Copyright */}
              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-1.5 xs:gap-2 text-gray-400 text-xs">
                <span>© {currentYear} SoundWave AB</span>
                <span>•</span>
                <span>Fait avec</span>
                <Heart className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-red-500" />
                <span>au Maroc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
