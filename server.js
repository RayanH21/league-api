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
        <h1>League of Legends API Documentation</h1>
        <p>Welcome to the League of Legends API documentation. Below you'll find the available endpoints:</p>
        <ul>
          <li>
            <h3>GET /champions</h3>
            <p>Retrieve all champions with optional filters, pagination, and sorting.</p>
            <p>Query Parameters:</p>
            <pre>
limit: Number of results per page (default: 10)
offset: Number of results to skip (default: 0)
name: Filter by champion name
role: Filter by champion role (e.g., "Mage", "Marksman")
difficulty: Filter by difficulty
sortBy: Field to sort by (e.g., "name", "role", "difficulty")
order: Sort order ("ASC" or "DESC")
            </pre>
          </li>
          <li>
            <h3>GET /champions/:id</h3>
            <p>Retrieve a specific champion by ID.</p>
          </li>
          <li>
            <h3>POST /champions</h3>
            <p>Create a new champion. (Requires authentication)</p>
            <p>Body (JSON):</p>
            <pre>
{
  "name": "Ashe",
  "role": "Marksman",
  "difficulty": 3,
  "description": "A ranged champion with crowd control abilities."
}
            </pre>
          </li>
          <li>
            <h3>PUT /champions/:id</h3>
            <p>Update an existing champion by ID. (Requires authentication)</p>
            <p>Body (JSON):</p>
            <pre>
{
  "name": "Ashe",
  "role": "Marksman",
  "difficulty": 4,
  "description": "Updated description of Ashe."
}
            </pre>
          </li>
          <li>
            <h3>DELETE /champions/:id</h3>
            <p>Delete a champion by ID. (Requires authentication)</p>
          </li>
          <li>
            <h3>GET /champions/:championId/builds</h3>
            <p>Retrieve all builds associated with a specific champion.</p>
          </li>
          <li>
            <h3>POST /champions/:championId/builds</h3>
            <p>Add a new build to a champion. (Requires authentication)</p>
            <p>Body (JSON):</p>
            <pre>
{
  "name": "Attack Build",
  "description": "A powerful attack-based build."
}
            </pre>
          </li>
          <li>
            <h3>GET /builds</h3>
            <p>Retrieve all builds with optional filters, pagination, and sorting.</p>
            <p>Query Parameters:</p>
            <pre>
limit: Number of results per page (default: 10)
offset: Number of results to skip (default: 0)
championId: Filter by associated champion ID
sortBy: Field to sort by (e.g., "name")
order: Sort order ("ASC" or "DESC")
            </pre>
          </li>
        </ul>
      </body>
    </html>
  `);
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log de fout naar de console
    res.status(500).json({ error: "Something went wrong!" });
  });


// Start server
app.listen(PORT, () => {
  console.log(`League API running on http://localhost:${PORT}`);
});
