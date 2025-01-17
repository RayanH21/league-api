const db = require("./db");

async function testConnection() {
  try {
    const [rows] = await db.query("SHOW TABLES");
    console.log("Database connected successfully. Tables:", rows);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testConnection();
