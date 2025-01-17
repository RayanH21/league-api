const express = require("express");
const router = express.Router();
const Build = require("../models/build.js");
const Champion = require("../models/champion.js"); // Model voor champions

// Haal alle builds voor een specifieke champion
router.get("/:championId/builds", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.championId);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    const builds = await Build.findByChampionId(req.params.championId);
    res.json(builds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch builds" });
  }
});

// Voeg een nieuwe build toe aan een champion
router.post("/:championId/builds", async (req, res) => {
  try {
    const { name, description } = req.body;
    const champion_id = req.params.championId;

    // Controleer of de champion bestaat
    const champion = await Champion.findById(champion_id);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const id = await Build.create({ name, description, champion_id });
    res.status(201).json({ id, message: "Build created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create build" });
  }
});

// Verwijder een specifieke build voor een champion
router.delete("/:championId/builds/:buildId", async (req, res) => {
  try {
    const { championId, buildId } = req.params;

    // Controleer of de champion bestaat
    const champion = await Champion.findById(championId);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    // Controleer of de build bestaat en bij de juiste champion hoort
    const build = await Build.findById(buildId);
    if (!build || build.champion_id !== parseInt(championId)) {
      return res.status(404).json({ error: "Build not found for this champion" });
    }

    await Build.delete(buildId);
    res.json({ message: "Build deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete build" });
  }
});

// Haal een specifieke build op voor een champion
router.get("/:championId/builds/:buildId", async (req, res) => {
  try {
    const { championId, buildId } = req.params;

    // Controleer of de champion bestaat
    const champion = await Champion.findById(championId);
    if (!champion) {
      return res.status(404).json({ error: "Champion not found" });
    }

    const build = await Build.findById(buildId);
    if (!build || build.champion_id !== parseInt(championId)) {
      return res.status(404).json({ error: "Build not found for this champion" });
    }

    res.json(build);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch build" });
  }
});

module.exports = router;
