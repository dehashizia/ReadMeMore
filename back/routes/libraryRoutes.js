const express = require("express");
const router = express.Router();
const LibraryController = require("../controllers/LibraryController");

router.post("/library/add", LibraryController.addToLibrary);

router.get("/library", LibraryController.getUserLibrary);

router.delete("/library/remove", LibraryController.removeFromLibrary);

module.exports = router;
