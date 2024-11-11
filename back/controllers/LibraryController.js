// controllers/LibraryController.js
const Library = require("../models/Library");

exports.getLibrary = async (req, res) => {
  const { user_id } = req.params;
  try {
    const library = await Library.findAll({ where: { user_id } });
    res.json(library);
  } catch (error) {
    console.error("Error fetching library", error);
    res.status(500).json({ error: "Unable to fetch library" });
  }
};

exports.addToLibrary = async (req, res) => {
  const { user_id, book_id, status } = req.body;

  try {
    const newLibraryItem = await Library.create({ user_id, book_id, status });
    res.status(201).json(newLibraryItem);
  } catch (error) {
    console.error("Error adding book to library", error);
    res.status(500).json({ error: "Unable to add book to library" });
  }
};

exports.updateLibraryStatus = async (req, res) => {
  const { library_id } = req.params;
  const { status } = req.body;

  try {
    const libraryItem = await Library.findByPk(library_id);
    if (!libraryItem) {
      return res.status(404).json({ error: "Library item not found" });
    }
    await libraryItem.update({ status });
    res.json(libraryItem);
  } catch (error) {
    console.error("Error updating library status", error);
    res.status(500).json({ error: "Unable to update library item" });
  }
};

exports.removeFromLibrary = async (req, res) => {
  const { library_id } = req.params;

  try {
    const libraryItem = await Library.findByPk(library_id);
    if (!libraryItem) {
      return res.status(404).json({ error: "Library item not found" });
    }
    await libraryItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error removing book from library", error);
    res.status(500).json({ error: "Unable to remove book from library" });
  }
};
