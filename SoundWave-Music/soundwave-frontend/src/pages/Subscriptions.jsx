import React, { useState, useEffect } from 'react';
import { 
  Crown,
  Check,
  Star,
  Zap,
  Headphones,
  Music,
  Download,
  Wifi,
  Smartphone,
  Monitor,
  Users,
  Shield,
  Gift,
  ArrowRight,
  Play,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      id: 'personal',
      name: 'Personnel',
      trial: 'Gratuit pendant 3 mois',
      price: '40 MAD/mois ensuite',
      description: '1 compte Spotify Premium',
      features: ['Annulez à tout moment', 'Abonnez-vous ou payez une fois'],
      button: 'Essai gratuit de 3 mois',
      popular: false,
      color: 'bg-gray-800',
      buttonColor: 'border border-white text-white hover:bg-white hover:text-black'
    },
    {
      id: 'duo',
      name: 'Duo',
      trial: '52 MAD pour 2 mois',
      price: '52 MAD/mois ensuite',
      description: '2 comptes Spotify Premium',
      features: ['Annulez à tout moment'],
      button: 'Essayez pendant 2 mois pour 52 MAD',
      popular: false,
      color: 'bg-gray-800',
      buttonColor: 'bg-white text-black hover:bg-gray-100'
    },
    {
      id: 'family',
      name: 'Famille',
      trial: '63 MAD pour 2 mois',
      price: '63 MAD/mois ensuite',
      description: 'Jusqu\'à 6 comptes Premium',
      features: ['Contrôle du contenu explicite', 'Annulez à tout moment'],
      button: 'Essayez pendant 2 mois pour 63 MAD',
      popular: false,
      color: 'bg-gray-800',
      buttonColor: 'bg-white text-black hover:bg-gray-100'
    },
    {
      id: 'student',
      name: 'Étudiants',
      trial: '20 MAD pour 2 mois',
      price: '20 MAD/mois ensuite',
      description: '1 compte Premium vérifié',
      features: ['Prix réduit pour les étudiants éligibles', 'Annulez à tout moment'],
      button: 'Essayez pendant 2 mois pour 20 MAD',
      popular: false,
      color: 'bg-gray-800',
      buttonColor: 'bg-white text-black hover:bg-gray-100'
    }
  ];

  const benefits = [
    'Musique sans pub',
    'Téléchargez pour écouter en mode hors connexion',
    'Choisissez l\'ordre de vos titres',
    'Qualité sonore supérieure',
    'Écoutez avec d\'autres personnes en temps réel',
    'Organisez la file d\'attente de lecture'
  ];

  const comparisonFeatures = [
    'Musique sans pub',
    'Télécharger des titres',
    'Choisissez l\'ordre de vos titres',
    'Son de qualité exceptionnelle',
    'Écoutez avec d\'autres personnes en temps réel',
    'Organisez la file d\'attente de lecture'
  ];

  const handleSubscribe = (planId) => {
    console.log(`Abonnement au plan: ${planId}`);
    // Ici vous pouvez intégrer votre logique de paiement
    alert(`Redirection vers le processus de paiement pour ${plans.find(p => p.id === planId)?.name}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Banner - Exactement comme Spotify */}
      <section className="relative">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              0,00 MAD pour 3 mois de Premium Personnel
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Écoutez votre musique sans pub, hors connexion, et bien plus encore. Annulez à tout moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300">
                Essai gratuit de 3 mois
              </button>
              <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                Voir tous les abonnements
              </button>
            </div>
            <p className="text-sm text-white/80 max-w-3xl mx-auto">
              Premium Personnel uniquement. Gratuit pendant 3 mois, puis 40 MAD par mois. 
              Offre uniquement disponible si vous n'avez jamais essayé Premium. 
              Offre soumise à conditions. Valable jusqu'au 22 septembre 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Section Abonnements abordables */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Des abonnements abordables pour chaque situation
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choisissez un abonnement Premium, et écoutez à volonté, sans pub, sur votre téléphone, 
              votre enceinte et d'autres appareils. Payez de différentes manières. Annulez à tout moment.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <span className="text-gray-400">Visa</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <span className="text-gray-400">Mastercard</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <span className="text-gray-400">American Express</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avantages inclus */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Avantages inclus dans tous les abonnements Premium
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 text-left">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Plans d'abonnement */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={plan.id}
                className={`bg-gray-800 p-6 rounded-lg transition-all duration-1000 delay-${700 + index * 100} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } flex flex-col h-full`}
              >
                <div className="text-center mb-6 flex-shrink-0">
                  <div className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    Premium
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{plan.trial}</div>
                  <div className="text-gray-400 text-sm mb-3">{plan.price}</div>
                  <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6 flex-shrink-0">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-400 text-sm">
                      • {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 px-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${plan.buttonColor}`}
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Comparaison - Exactement comme Spotify */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Vivez la différence
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Passez à Premium et bénéficiez d'un contrôle total sur votre musique. Annulez à tout moment.
            </p>
          </div>

          {/* Tableau de comparaison */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 text-center border-b border-gray-700">
              <div className="p-4 font-semibold text-white">Vos avantages</div>
              <div className="p-4 font-semibold text-gray-400">Spotify sans abonnement</div>
              <div className="p-4 font-semibold text-white">Premium</div>
            </div>
            
            {comparisonFeatures.map((feature, index) => (
              <div key={index} className="grid grid-cols-3 text-center border-b border-gray-700 last:border-b-0">
                <div className="p-4 text-gray-300 text-sm">{feature}</div>
                <div className="p-4 text-gray-500">-</div>
                <div className="p-4 text-green-500 font-bold">✔</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre expérience musicale ?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des millions d'utilisateurs qui ont déjà fait le choix de la qualité Premium.
            </p>
            <button
              onClick={() => handleSubscribe('personal')}
              className="bg-green-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2 mx-auto"
            >
              <Crown className="h-6 w-6" />
              <span>Commencer l'essai gratuit</span>
            </button>
            <p className="text-sm text-gray-500 mt-6">
              Essai gratuit de 3 mois • Annulation à tout moment
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
