const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");

router.get("/", async (req, res) => {
  try {
    const champions = await Champion.findAll();
    res.json(champions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champions" });
  }
});

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
  
  router.post("/", async (req, res) => {
    try {
      const { name, role, difficulty, description } = req.body;
      if (!name || !role || !difficulty) {
        return res.status(400).json({ error: "Name, role, and difficulty are required" });
      }
      const id = await Champion.create({ name, role, difficulty, description });
      res.status(201).json({ id, message: "Champion created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create champion" });
    }
  });

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
  