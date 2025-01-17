const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === "Bearer mysecrettoken") {
      return next(); // Toegang toegestaan
    }
    return res.status(401).json({ error: "Unauthorized" });
  };
  
  module.exports = authenticate;
  