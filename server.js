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

// Start server
app.listen(PORT, () => {
  console.log(`League API running on http://localhost:${PORT}`);
});
