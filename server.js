const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const championRoutes = require("./routes/champions");
const buildRoutes = require("./routes/builds");

app.use("/champions", championRoutes);
app.use("/builds", buildRoutes);

// Documentatie
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>League of Legends API Documentation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
          }
          h1 {
            color: #333;
          }
          h3 {
            color: #555;
          }
          pre {
            background: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>League of Legends API</h1>
        <p>Welcome to the League of Legends API documentation. Below you'll find the available endpoints:</p>
        <ul>
          <li>
            <h3>GET /champions</h3>
            <p>Retrieve all champions.</p>
            <p>Response:</p>
            <pre>
[
  {
    "id": 1,
    "name": "Ashe",
    "role": "Marksman",
    "difficulty": 3,
    "description": "A ranged champion with crowd control abilities."
  },
  {
    "id": 2,
    "name": "Ahri",
    "role": "Mage",
    "difficulty": 4,
    "description": "A mage with charm abilities."
  }
]
            </pre>
          </li>
          <li>
            <h3>GET /champions/:id</h3>
            <p>Retrieve a specific champion by ID.</p>
            <p>Response:</p>
            <pre>
{
  "id": 1,
  "name": "Ashe",
  "role": "Marksman",
  "difficulty": 3,
  "description": "A ranged champion with crowd control abilities."
}
            </pre>
          </li>
          <li>
            <h3>POST /champions</h3>
            <p>Create a new champion.</p>
            <p>Body (JSON):</p>
            <pre>
{
  "name": "Ashe",
  "role": "Marksman",
  "difficulty": 3,
  "description": "A ranged champion with crowd control abilities."
}
            </pre>
            <p>Response:</p>
            <pre>
{
  "id": 3,
  "message": "Champion created successfully"
}
            </pre>
          </li>
          <li>
            <h3>PUT /champions/:id</h3>
            <p>Update an existing champion by ID.</p>
            <p>Body (JSON):</p>
            <pre>
{
  "name": "Ashe",
  "role": "Marksman",
  "difficulty": 4,
  "description": "Updated description of Ashe."
}
            </pre>
            <p>Response:</p>
            <pre>
{
  "message": "Champion updated successfully"
}
            </pre>
          </li>
          <li>
            <h3>DELETE /champions/:id</h3>
            <p>Delete a champion by ID.</p>
            <p>Response:</p>
            <pre>
{
  "message": "Champion deleted successfully"
}
            </pre>
          </li>
        </ul>

        <h2>Error Codes</h2>
        <ul>
          <li>
            <strong>400 Bad Request:</strong> Invalid input data or missing required fields.
          </li>
          <li>
            <strong>404 Not Found:</strong> The requested resource does not exist.
          </li>
          <li>
            <strong>500 Internal Server Error:</strong> Server encountered an error.
          </li>
        </ul>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`League API running on http://localhost:${PORT}`);
});
