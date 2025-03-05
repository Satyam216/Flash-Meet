const admin = require("firebase-admin");
const serviceAccount = require("./firebaseService.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
