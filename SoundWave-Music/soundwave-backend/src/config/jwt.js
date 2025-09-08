const config = {
  secret: process.env.JWT_SECRET || 'Mouhamed12@',
  expiresIn: process.env.JWT_EXPIRE || '7d', // Durée de validité du token (ex: 7 jours)
  issuer: 'soundwave-app', // Optionnel : identifiant de l'émetteur du token
};

console.log('🔧 Configuration JWT chargée:', {
  secret: config.secret.substring(0, 10) + '...',
  expiresIn: config.expiresIn,
  issuer: config.issuer,
  envSecret: process.env.JWT_SECRET ? 'défini' : 'non défini'
});

module.exports = config; 