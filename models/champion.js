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

  // Haal champions op met paginatie en sorteren
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

  // Haal een champion op basis van naam
  static async findByName(name) {
    const [rows] = await db.query("SELECT * FROM champions WHERE name = ?", [name]);
    return rows[0];
  }

  // Zoek champions op meerdere velden
  static async searchByMultipleFields({ name, role, difficulty, limit = 10, offset = 0, sortBy = "id", order = "ASC" }) {
    const validSortFields = ["id", "name", "role", "difficulty"];
    const validOrder = ["ASC", "DESC"];
  
    // Controleer of sorteerparameters geldig zijn
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field. Valid fields are: ${validSortFields.join(", ")}`);
    }
    if (!validOrder.includes(order.toUpperCase())) {
      throw new Error(`Invalid order value. Use 'ASC' or 'DESC'.`);
    }
  
    let query = "SELECT * FROM champions WHERE 1=1";
    const params = [];
  
    // Voeg dynamisch filters toe aan de query
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
  
    // Voeg sortering en paginatie toe
    query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
  
    const [rows] = await db.query(query, params);
    return rows;
  }
  
}

module.exports = Champion;
