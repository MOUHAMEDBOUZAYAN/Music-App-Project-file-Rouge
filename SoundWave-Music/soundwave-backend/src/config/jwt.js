module.exports = {
  secret: process.env.JWT_SECRET || 'Mouhamed12@',
  expiresIn: '7d', // Durée de validité du token (ex: 7 jours)
  issuer: 'soundwave-app', // Optionnel : identifiant de l'émetteur du token
}; 