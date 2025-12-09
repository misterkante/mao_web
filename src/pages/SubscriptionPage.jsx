import { ArrowLeft, X, Check, Crown, Mic, MapPin, CreditCard, Shield, RotateCcw, User } from 'lucide-react';
import { useState } from 'react';
import logoMao from '../assets/logo-Mao1.PNG';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'explorateur',
      name: 'Explorateur',
      badge: 'ACTUEL',
      badgeColor: 'bg-gray-500',
      price: 'Gratuit',
      icon: <User className="w-8 h-8 text-gray-500" />,
      features: [
        { text: '3 messages par œuvre', included: true },
        { text: 'Scan illimité', included: true },
        { text: 'Pas de voix', included: false },
        { text: 'Pas de quêtes', included: false }
      ],
      buttonText: 'Plan actuel',
      buttonStyle: 'bg-white text-gray-700 border-2 border-gray-300',
      borderColor: 'border-gray-200'
    },
    {
      id: 'createur',
      name: 'Créateur',
      badge: 'POPULAIRE',
      badgeColor: 'bg-orange-500',
      price: '9.99€',
      priceSubtext: 'par mois',
      icon: <Crown className="w-8 h-8 text-orange-500" />,
      features: [
        { text: 'Messages texte illimités', included: true },
        { text: 'Accès prioritaire nouvelles œuvres', included: true },
        { text: 'Historique complet', included: true },
        { text: 'Badge Premium', included: true },
        { text: 'Support prioritaire', included: true }
      ],
      buttonText: 'S\'abonner maintenant',
      buttonStyle: 'bg-orange-500 text-white hover:bg-orange-600',
      borderColor: 'border-orange-500',
      highlighted: true
    },
    {
      id: 'pack-voix',
      name: 'Pack Voix',
      subtitle: 'pour 1 heure de conversation vocale',
      price: '6€',
      icon: <Mic className="w-8 h-8 text-blue-600" />,
      features: [
        { text: 'Parle avec les œuvres', included: true },
        { text: 'Voix unique par œuvre', included: true },
        { text: 'Pas d\'expiration', included: true }
      ],
      buttonText: 'Acheter des crédits',
      buttonStyle: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
      borderColor: 'border-blue-600'
    },
    {
      id: 'pass-ville',
      name: 'Pass Ville',
      subtitle: 'Débride une ville entière',
      price: 'Variable',
      icon: <MapPin className="w-8 h-8 text-red-500" />,
      features: [
        { text: 'Messages illimités dans une ville', included: true },
        { text: 'Toutes les quêtes de la ville', included: true },
        { text: 'Valable 30 jours', included: true }
      ],
      buttonText: 'Explorer les Pass',
      buttonStyle: 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-50',
      borderColor: 'border-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Choisis ton Expérience</h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-orange-500 rounded-2xl mb-4 p-3">
            <img src={logoMao} alt="MAO Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Parle sans limites avec l'art
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Débride ton expérience MAO
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 border-2 ${plan.borderColor} ${
                plan.highlighted ? 'shadow-lg relative' : 'shadow-sm'
              } transition-all hover:shadow-md`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-4">
                  <span className={`${plan.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-4">
                <div>{plan.icon}</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                  {plan.subtitle && (
                    <p className="text-xs text-gray-600">{plan.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className={`text-3xl md:text-4xl font-bold ${
                  plan.id === 'createur' ? 'text-orange-500' :
                  plan.id === 'pack-voix' ? 'text-blue-600' :
                  plan.id === 'pass-ville' ? 'text-red-500' :
                  'text-gray-900'
                }`}>
                  {plan.price}
                </div>
                {plan.priceSubtext && (
                  <div className="text-sm text-gray-600">{plan.priceSubtext}</div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        feature.included ? 'text-green-500' : 'text-gray-300'
                      }`}
                    />
                    <span className={`text-sm ${
                      feature.included ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${plan.buttonStyle}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Link */}
        <div className="text-center mb-8">
          <button className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors inline-flex items-center gap-2">
            Voir la comparaison détaillée →
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-4">
            <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-700">Paiement sécurisé</p>
            <p className="text-xs text-gray-500">Stripe</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <Shield className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-700">Annule quand tu veux</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <RotateCcw className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-700">Remboursement</p>
            <p className="text-xs text-gray-500">7 jours</p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto">
          En souscrivant, tu acceptes nos conditions générales
        </p>
      </div>
    </div>
  );
}