// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// ROUTE IMPORTS
import donorRoutes from "./routes/donorRoutes.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import donorOfferRoutes from "./routes/donorOfferRoutes.js";

dotenv.config();

const app = express();
// Render provides the PORT variable automatically
const PORT = process.env.PORT || 3001;

// Allow your local testing and your live Netlify site
const allowedOrigins = [
  "http://localhost:3000",
  "https://cheerful-malasada-7bbd5a.netlify.app" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// MOUNT ROUTES
app.use("/api/donors", donorRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blood-request", bloodRequestRoutes);
app.use("/api/donor-offer", donorOfferRoutes);

const startServer = async () => {
  try {
    // These credentials must be set in Render Environment Variables
    await sequelize.authenticate();
    console.log("✅ Connected to Cloud MySQL");

    await sequelize.sync();
    console.log("📦 Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
};

startServer();