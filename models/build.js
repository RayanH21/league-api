const db = require("../config/db");

class Build {
  // Haal alle builds op voor een specifieke champion
  static async findByChampionId(championId) {
    const [rows] = await db.query("SELECT * FROM builds WHERE champion_id = ?", [championId]);
    return rows;
  }

  // Haal een specifieke build op
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM builds WHERE id = ?", [id]);
    return rows[0];
  }

  // Voeg een nieuwe build toe
  static async create(data) {
    const { name, description, champion_id } = data;
    const [result] = await db.query(
      "INSERT INTO builds (name, description, champion_id) VALUES (?, ?, ?)",
      [name, description, champion_id]
    );
    return result.insertId;
  }

  // Update een bestaande build
  static async update(id, data) {
    const { name, description } = data;
    await db.query(
      "UPDATE builds SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
  }

  // Verwijder een build
  static async delete(id) {
    await db.query("DELETE FROM builds WHERE id = ?", [id]);
  }

  // Tel het aantal builds voor een specifieke champion
  static async countByChampionId(championId) {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM builds WHERE champion_id = ?", [championId]);
    return rows[0].total;
  }
}

module.exports = Build;
