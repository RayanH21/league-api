const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");

// Haal alle champions op met paginatie en zoeken
router.get("/", async (req, res) => {
  try {
    const { limit = 10, offset = 0, search } = req.query;

    // Validatie van limit en offset
    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).json({ error: "Limit and offset must be numbers" });
    }

    let champions;
    if (search) {
      // Zoek op naam of rol als 'search' parameter aanwezig is
      champions = await Champion.searchByNameOrRole(search);
    } else {
      // Haal champions op met paginatie
      champions = await Champion.findWithPagination(parsedLimit, parsedOffset);
    }

    res.json(champions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champions" });
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
    const { name, role, difficulty, description } = req.body;

    // Basisvalidatie
    if (!name || !role || !difficulty) {
      return res.status(400).json({ error: "Name, role, and difficulty are required" });
    }
    if (typeof difficulty !== "number" || difficulty < 1 || difficulty > 5) {
      return res.status(400).json({ error: "Difficulty must be a number between 1 and 5" });
    }

    const id = await Champion.create({ name, role, difficulty, description });
    res.status(201).json({ id, message: "Champion created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create champion" });
  }
});

// Update een bestaande champion
router.put("/:id", async (req, res) => {
  try {
    const { name, role, difficulty, description } = req.body;
    const champion = await Champion.findById(req.params.id);

    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

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
