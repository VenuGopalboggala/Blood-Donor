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
const PORT = process.env.PORT || 3001;


// 1. UPDATED: Added the specific build URL and a wildcard check
const allowedOrigins = [
  "http://localhost:3000",
  "https://cheerful-malasada-7bbd5a.netlify.app",
  "https://6942b79a8b0b7e3777603dca--cheerful-malasada-7bbd5a.netlify.app" // The one from your error
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);

      // 2. Allow any URL that ends with .netlify.app or is localhost
      const isNetlify = origin.endsWith(".netlify.app");
      const isLocal = origin.includes("localhost");

      if (isNetlify || isLocal) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
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
    await sequelize.authenticate();
    console.log("✅ Connected to Cloud MySQL");

    await sequelize.sync({ alter: true }); 
    console.log("📦 Models synchronized");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err);
  }
};



startServer();