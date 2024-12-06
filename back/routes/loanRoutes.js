const express = require("express");
const router = express.Router();
const LoanController = require("../controllers/LoanController");

// Créer une demande de prêt
router.post("/loans/request", LoanController.createLoanRequest);

// Répondre à une demande de prêt (accepter/refuser)
router.post("/loans/respond", LoanController.respondToLoanRequest);

// Récupérer toutes les demandes de prêt d'un utilisateur
router.get("/loans", LoanController.getUserLoanRequests);

module.exports = router;
