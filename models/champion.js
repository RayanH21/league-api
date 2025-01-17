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

  // Haal champions op met paginatie
  static async findWithPagination(limit = 10, offset = 0) {
    const [rows] = await db.query(
      "SELECT * FROM champions LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  // Zoek champions op naam of rol
  static async searchByNameOrRole(search) {
    const [rows] = await db.query(
      "SELECT * FROM champions WHERE name LIKE ? OR role LIKE ?",
      [`%${search}%`, `%${search}%`]
    );
    return rows;
  }

  // Tel het totaal aantal champions (voor paginatie of statistieken)
  static async count() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM champions");
    return rows[0].total;
  }

  static async findWithPaginationAndSort(limit = 10, offset = 0, sortBy = "id", order = "ASC") {
    const validSortFields = ["id", "name", "role", "difficulty"];
    const validOrder = ["ASC", "DESC"];
  
    // Controleer of de sorteerparameters geldig zijn
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field. Valid fields are: ${validSortFields.join(", ")}`);
    }
    if (!validOrder.includes(order.toUpperCase())) {
      throw new Error(`Invalid order value. Use 'ASC' or 'DESC'.`);
    }
  
    const [rows] = await db.query(
      `SELECT * FROM champions ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    return rows;
  }
  
}

module.exports = Champion;
