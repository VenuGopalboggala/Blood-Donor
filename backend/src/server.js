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

// 1. UPDATED: Ensure your live Netlify URL is exactly correct
const allowedOrigins = [
  "http://localhost:3000",
  "https://cheerful-malasada-7bbd5a.netlify.app" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or if the origin is in our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin); // Helps you debug if it fails
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
    // 2. These credentials must be set in Render Environment Variables
    await sequelize.authenticate();
    console.log("✅ Connected to Cloud MySQL");

    // use alter:true only if you want to update tables without losing data
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