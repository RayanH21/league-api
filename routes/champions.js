const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");
const authenticate = require("../middleware/auth"); // Middleware voor authenticatie

// Helperfunctie voor validatie
const validRoles = ["Mage", "Marksman", "Tank", "Support", "Assassin", "Fighter"];

const validateChampion = async (data, isUpdate = false) => {
  const { name, role, difficulty, description } = data;

  if (!isUpdate && (!name || !role || !difficulty)) {
    return "Name, role, and difficulty are required.";
  }

  if (role && !validRoles.includes(role)) {
    return `Invalid role. Valid roles are: ${validRoles.join(", ")}.`;
  }

  if (difficulty !== undefined && (typeof difficulty !== "number" || isNaN(difficulty))) {
    return "Difficulty must be a number.";
  }
  if (difficulty < 1 || difficulty > 5) {
    return "Difficulty must be between 1 and 5.";
  }

  return null; // Geen validatiefouten
};

// Haal alle champions op met zoeken, paginatie, en sorteren
router.get("/", async (req, res) => {
  try {
    const { limit = 10, offset = 0, name, role, difficulty, sortBy = "id", order = "ASC" } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: "Limit and offset must be numbers" });
    }

    const sortByArray = sortBy.split(",");
    const orderArray = order.split(",");

    const champions = await Champion.searchByMultipleFields({
      name,
      role,
      difficulty,
      limit: parsedLimit,
      offset: parsedOffset,
      sortBy: sortByArray,
      order: orderArray,
    });

    const total = await Champion.count();

    res.json({ total, champions });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch champions" });
  }
});

// Haal een specifieke champion op
router.get("/:id", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }
    res.json(champion);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champion" });
  }
});

// Voeg een nieuwe champion toe (alleen geauthenticeerde gebruikers)
router.post("/", authenticate, async (req, res) => {
  try {
    const error = await validateChampion(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const { name, role, difficulty, description } = req.body;
    const id = await Champion.create({ name, role, difficulty, description });
    res.status(201).json({ id, message: "Champion created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create champion" });
  }
});

// Update een bestaande champion (alleen geauthenticeerde gebruikers)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    const error = await validateChampion({ ...req.body, id: req.params.id }, true);
    if (error) {
      return res.status(400).json({ error });
    }

    const { name, role, difficulty, description } = req.body;
    await Champion.update(req.params.id, { name, role, difficulty, description });
    res.json({ message: "Champion updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update champion" });
  }
});

// Verwijder een champion (alleen geauthenticeerde gebruikers)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    await Champion.delete(req.params.id);
    res.json({ message: "Champion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete champion" });
  }
});

module.exports = router;
