const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");

// Helperfunctie voor validatie
const validateChampion = async (data, isUpdate = false) => {
  const { name, role, difficulty, description } = data;

  // Controleer verplichte velden
  if (!isUpdate) {
    if (!name || !role || !difficulty) {
      return "Name, role, and difficulty are required.";
    }
  }

  // Controleer op numerieke waarden en valid range
  if (difficulty !== undefined && (typeof difficulty !== "number" || difficulty < 1 || difficulty > 5)) {
    return "Difficulty must be a number between 1 and 5.";
  }

  // Controleer lengte van description
  if (description && description.length > 255) {
    return "Description cannot exceed 255 characters.";
  }

  // Controleer of de naam uniek is (bij POST of als de naam verandert bij PUT)
  if (name) {
    const existingChampion = await Champion.findByName(name);
    if (existingChampion && (!isUpdate || existingChampion.id !== data.id)) {
      return "A champion with this name already exists.";
    }
  }

  return null; // Geen validatiefouten
};

// Haal alle champions op met zoeken, paginatie, en sorteren
router.get("/", async (req, res) => {
  try {
    const { limit = 10, offset = 0, name, role, difficulty, sortBy = "id", order = "ASC" } = req.query;

    // Validatie van limit en offset
    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: "Limit and offset must be numbers" });
    }

    // Validatie van sorteerparameters
    const validSortFields = ["id", "name", "role", "difficulty"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: `Invalid sort field. Valid fields are: ${validSortFields.join(", ")}` });
    }
    if (!["ASC", "DESC"].includes(order.toUpperCase())) {
      return res.status(400).json({ error: "Order must be 'ASC' or 'DESC'" });
    }

    // Zoek champions met filters, paginatie en sorteren
    const champions = await Champion.searchByMultipleFields({
      name,
      role,
      difficulty,
      limit: parsedLimit,
      offset: parsedOffset,
      sortBy,
      order,
    });

    // Tel het totale aantal resultaten
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

// Voeg een nieuwe champion toe
router.post("/", async (req, res) => {
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

// Update een bestaande champion
router.put("/:id", async (req, res) => {
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

// Verwijder een champion
router.delete("/:id", async (req, res) => {
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
