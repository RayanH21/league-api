const db = require("../config/db");

class Champion {
  // Haal alle champions op
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM champions");
    return rows;
  }

  // Haal een champion op op basis van ID
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM champions WHERE id = ?", [id]);
    return rows[0];
  }

  // Voeg een nieuwe champion toe
  static async create(data) {
    const { name, role, difficulty, description } = data;
    const [result] = await db.query(
      "INSERT INTO champions (name, role, difficulty, description) VALUES (?, ?, ?, ?)",
      [name, role, difficulty, description]
    );
    return result.insertId;
  }

  // Update een bestaande champion
  static async update(id, data) {
    const { name, role, difficulty, description } = data;
    await db.query(
      "UPDATE champions SET name = ?, role = ?, difficulty = ?, description = ? WHERE id = ?",
      [name, role, difficulty, description, id]
    );
  }

  // Verwijder een champion
  static async delete(id) {
    await db.query("DELETE FROM champions WHERE id = ?", [id]);
  }

  // Haal champions op met paginatie en sorteren
  static async findWithPaginationAndSort({ limit = 10, offset = 0, sortBy = ["id"], order = ["ASC"] }) {
    const validSortFields = ["id", "name", "role", "difficulty"];
    const validOrder = ["ASC", "DESC"];

    const sortQueries = sortBy.map((field, index) => {
      if (!validSortFields.includes(field)) {
        throw new Error(`Invalid sort field: ${field}`);
      }
      const sortOrder = validOrder.includes(order[index]?.toUpperCase()) ? order[index].toUpperCase() : "ASC";
      return `${field} ${sortOrder}`;
    });

    const query = `SELECT * FROM champions ORDER BY ${sortQueries.join(", ")} LIMIT ? OFFSET ?`;
    const [rows] = await db.query(query, [parseInt(limit), parseInt(offset)]);
    return rows;
  }

  // Zoek champions op meerdere velden met filters
  static async searchByMultipleFields({ name, role, difficulty, limit = 10, offset = 0, sortBy = ["id"], order = ["ASC"] }) {
    const validSortFields = ["id", "name", "role", "difficulty"];
    const validOrder = ["ASC", "DESC"];

    const sortQueries = sortBy.map((field, index) => {
      if (!validSortFields.includes(field)) {
        throw new Error(`Invalid sort field: ${field}`);
      }
      const sortOrder = validOrder.includes(order[index]?.toUpperCase()) ? order[index].toUpperCase() : "ASC";
      return `${field} ${sortOrder}`;
    });

    let query = "SELECT * FROM champions WHERE 1=1";
    const params = [];

    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (role) {
      query += " AND role LIKE ?";
      params.push(`%${role}%`);
    }
    if (difficulty) {
      query += " AND difficulty = ?";
      params.push(difficulty);
    }

    query += ` ORDER BY ${sortQueries.join(", ")} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Tel het totaal aantal champions
  static async count() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM champions");
    return rows[0].total;
  }
}

module.exports = Champion;
