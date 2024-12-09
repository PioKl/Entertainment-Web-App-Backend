const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token do weryfikacji:", token); // Token do weryfikacji

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Błąd weryfikacji tokena:", err); // Błąd weryfikacji
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user; // Dodanie użytkownika do obiektu `req` do późniejszego użycia
    next();
  });
}

module.exports = authenticateToken;
