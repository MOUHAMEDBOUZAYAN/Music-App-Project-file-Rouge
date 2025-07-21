module.exports = {
  secret: process.env.JWT_SECRET || 'votre_cle_secrete_super_secrete',
  expiresIn: '7d', // Durée de validité du token (ex: 7 jours)
  issuer: 'soundwave-app', // Optionnel : identifiant de l'émetteur du token
}; 