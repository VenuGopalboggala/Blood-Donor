import express from "express";
import Donor from "../models/Donor.js";

const router = express.Router();

// 1. GET ALL donors (Available and Complete profiles)
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.findAll({
      where: {
        isAvailable: true,
        isProfileComplete: true
      }
    });
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Error fetching donors" });
  }
});

// 2. GET SINGLE donor by ID (This fixes your empty profile issue)
router.get("/:id", async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.json(donor);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// 3. CREATE a new donor
router.post("/", async (req, res) => {
  try {
    const { name, email, bloodType, city, phone } = req.body;

    if (!name || !email || !bloodType) {
      return res.status(400).json({ message: "Name, email, and blood type are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await Donor.findOne({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(400).json({ message: "Email already used." });
    }

    const donor = await Donor.create({
      name,
      email: cleanEmail,
      bloodType,
      city: city || "",
      phone: phone || "", // Ensure phone is saved
      isProfileComplete: true, // Mark as complete so they show up in lists
      isAvailable: true
    });

    res.status(201).json(donor);
  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).json({ message: "Error creating donor" });
  }
});

// 4. DELETE donor
router.delete("/:id", async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    await donor.destroy();
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ message: "Error deleting donor" });
  }
});

export default router;