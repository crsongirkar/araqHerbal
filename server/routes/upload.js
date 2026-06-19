const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { adminAuth } = require("../utils/authMiddleware");

const uploadDir = path.join(__dirname, "..", "..", "client", "public", "uploads");

// Configure Storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9-]/g, "_").toLowerCase();
    const filename = `${Date.now()}-${safeBase}${ext.toLowerCase()}`;
    cb(null, filename);
  }
});

// Configure File Filters
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/upload", adminAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const url = `/uploads/${req.file.filename}`;
    return res.json({ url, filename: req.file.filename });
  } catch (error) {
    console.error("Upload route error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// Error handling middleware for Multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum 5MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
