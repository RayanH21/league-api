const db = require("../config/db");

class Champion {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM champions");
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM champions WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, role, difficulty, description } = data;
    const [result] = await db.query(
      "INSERT INTO champions (name, role, difficulty, description) VALUES (?, ?, ?, ?)",
      [name, role, difficulty, description]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { name, role, difficulty, description } = data;
    await db.query(
      "UPDATE champions SET name = ?, role = ?, difficulty = ?, description = ? WHERE id = ?",
      [name, role, difficulty, description, id]
    );
  }

  static async delete(id) {
    await db.query("DELETE FROM champions WHERE id = ?", [id]);
  }
}

module.exports = Champion;
