const { LoanRequest, Book, User } = require("../models"); // Assure-toi que les modèles sont bien importés

// Créer une demande de prêt
const createLoanRequest = async (req, res) => {
  const { bookId } = req.body;
  const requesterId = req.user.id; // Utilisateur actuellement connecté

  try {
    const book = await Book.findByPk(bookId);

    if (!book || !book.is_available_for_loan) {
      return res
        .status(404)
        .json({ error: "Livre indisponible ou non trouvé." });
    }

    const loanRequest = await LoanRequest.create({
      requester_id: requesterId,
      book_id: bookId,
    });

    res.json({ message: "Demande de prêt créée avec succès.", loanRequest });
  } catch (error) {
    console.error("Erreur lors de la création de la demande de prêt :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};

// Répondre à une demande de prêt (accepter ou refuser)
const respondToLoanRequest = async (req, res) => {
  const { loanRequestId, status } = req.body;

  try {
    const loanRequest = await LoanRequest.findByPk(loanRequestId, {
      include: { model: Book },
    });

    if (!loanRequest || loanRequest.Book.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Vous n'avez pas le droit de gérer cette demande." });
    }

    loanRequest.status = status;
    await loanRequest.save();

    if (status === "accepted") {
      const book = loanRequest.Book;
      book.is_available_for_loan = false; // Le livre n'est plus disponible
      await book.save();
    }

    res.json({ message: `Demande de prêt ${status}.` });
  } catch (error) {
    console.error("Erreur lors de la réponse à la demande de prêt :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};

const getUserLoanRequests = async (req, res) => {
  try {
    const userId = req.user.id; // Assure-toi que tu récupères bien l'ID de l'utilisateur authentifié
    const loanRequests = await LoanRequest.findAll({
      where: { requester_id: userId }, // Filtrer par l'utilisateur connecté
      include: [
        {
          model: Book,
          as: "book", // Utilisation de l'alias défini dans la relation
          attributes: ["title"], // Inclure seulement le titre du livre
        },
      ],
    });
    res.json(loanRequests);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes de prêt :",
      error
    );
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

module.exports = {
  createLoanRequest,
  respondToLoanRequest,
  getUserLoanRequests,
};
