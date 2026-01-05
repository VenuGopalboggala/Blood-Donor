// backend/src/routes/authRoutes.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/Donor.js";
import Recipient from "../models/Recipient.js";

const router = Router();
const JWT_SECRET = "your_jwt_secret_key";

/* ----------------------- FORGOT PASSWORD ----------------------- */
// This route checks if the email exists and verifies the user type
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, userType } = req.body;
    const cleanEmail = email.trim().toLowerCase(); // Ensure consistency

    let user;
    if (userType === "donor") {
      user = await Donor.findOne({ where: { email: cleanEmail } });
    } else {
      user = await Recipient.findOne({ where: { email: cleanEmail } });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User verified. Enter your new password." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/* ----------------------- RESET PASSWORD ----------------------- */
// This route updates the password in the database
router.post("/reset-password", async (req, res) => {
  try {
    const { email, userType, newPassword } = req.body;
    let user;

    const hashed = await bcrypt.hash(newPassword, 10);

    if (userType === "donor") {
      user = await Donor.findOne({ where: { email } });
    } else {
      user = await Recipient.findOne({ where: { email } });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the password
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
});

/* ----------------------- DONOR REGISTER ----------------------- */
router.post("/register/donor", async (req, res) => {
  try {
    const { name, email, password, bloodType, city } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await Donor.create({
      name,
      email,
      password: hashed,
      bloodType,
      city,
    });

    res.status(201).json({ message: "Donor registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering donor" });
  }
});

/* ----------------------- DONOR LOGIN ----------------------- */
router.post("/login/donor", async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ where: { email } });

    if (!donor) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, donor.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: donor.id, type: "donor" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      id: donor.id,
      userId: donor.id,
      userType: "donor"
    });
  } catch (error) {
    console.error("Donor login error:", error);
    return res.status(500).json({ message: "Error logging in donor" });
  }
});

/* ----------------------- SEEKER REGISTER ----------------------- */
router.post("/register/seeker", async (req, res) => {
  try {
    const { name, email, password, bloodType, hospitalName, contactPhone, lat, lng } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await Recipient.create({
      name,
      email,
      password: hashed,
      bloodType,
      hospitalName,
      contactPhone,
      lat: lat || null,
      lng: lng || null,
    });

    res.status(201).json({ message: "Seeker registered" });
  } catch (err) {
    console.error("Seeker register error:", err);
    res.status(500).json({ message: "Error registering seeker" });
  }
});

/* ----------------------- SEEKER LOGIN ----------------------- */
router.post("/login/seeker", async (req, res) => {
  try {
    const { email, password } = req.body;
    const seeker = await Recipient.findOne({ where: { email } });

    if (!seeker) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, seeker.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: seeker.id, type: "seeker" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      id: seeker.id,
      userId: seeker.id,
      userType: "seeker"
    });
  } catch (error) {
    console.error("Seeker login error:", error);
    return res.status(500).json({ message: "Error logging in seeker" });
  }
});

export default router;