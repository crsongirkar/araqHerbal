const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");
const Order = require("../models/Order");
const Subscriber = require("../models/Subscriber");
const { getOtpEmailTemplate, getSubscriptionEmailTemplate, getWelcomeEmailTemplate } = require("../utils/emailTemplate");
const { adminAuth, ADMIN_COOKIE_NAME, JWT_SECRET } = require("../utils/authMiddleware");
const { sendEmail } = require("../utils/emailSender");

const USER_COOKIE_NAME = "araq_user_token";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";


router.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Otp.deleteMany({ email: normalizedEmail });
    await Otp.create({ email: normalizedEmail, code });
    console.log(`🔑 [OTP Generate] Code is: ${code} for email: ${normalizedEmail}`);

    // Try sending email asynchronously
    sendEmail(normalizedEmail, "ARAQ Verification Code", getOtpEmailTemplate(code));

    return res.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ error: "Failed to send verification code." });
  }
});


router.post("/auth/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const otpDoc = await Otp.findOne({ email: normalizedEmail, code: code.trim() });
    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Code is valid - clean it up
    await Otp.deleteMany({ email: normalizedEmail });

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      // Create new user automatically
      const namePrefix = normalizedEmail.split("@")[0];
      const name = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
      user = await User.create({
        name,
        email: normalizedEmail,
        role: "Customer",
        status: "Active"
      });
      console.log(`[Register] New customer registered via OTP: ${normalizedEmail}`);
    } else if (user.status === "Suspended") {
      return res.status(403).json({ error: "Your account is suspended. Please contact support." });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send welcome email if new account was created
    if (isNewUser) {
      sendEmail(user.email, "Welcome to the ARAQ Family!", getWelcomeEmailTemplate(user.name));
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ error: "Failed to verify code." });
  }
});

// 3. Admin Auth - Login (POST)
router.post("/admin/auth", async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: "Administrator" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/"
    });
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Admin Auth - Logout (DELETE)
router.delete("/admin/auth", async (req, res) => {
  res.cookie(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/"
  });
  return res.json({ success: true, message: "Logged out" });
});

// Admin Auth - Verify Session (GET)
router.get("/admin/auth", adminAuth, async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  return res.json({ authenticated: true });
});

// 4. Customer Session (GET)
router.get("/auth/session", async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user || user.status === "Suspended") {
      res.clearCookie(USER_COOKIE_NAME);
      return res.json({ authenticated: false });
    }
    return res.json({ authenticated: true, user });
  } catch (error) {
    res.clearCookie(USER_COOKIE_NAME);
    return res.json({ authenticated: false });
  }
});

// 5. Customer Logout (POST/DELETE)
router.post("/auth/logout", async (req, res) => {
  res.clearCookie(USER_COOKIE_NAME);
  return res.json({ success: true, message: "Logged out successfully" });
});

// 6. Update Profile (PUT)
router.put("/auth/profile", async (req, res) => {
  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, address } = req.body;

    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) {
      user.address = {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || ""
      };
    }

    await user.save();
    return res.json({ success: true, user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// 7. Get Customer Orders (GET)
router.get("/auth/orders", async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use case-insensitive match so orders saved with any email casing are found
    const orders = await Order.find({ customerEmail: { $regex: new RegExp(`^${user.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
    return res.json(orders);
  } catch (error) {
    console.error("Fetch profile orders error:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// ─────────────────────────────────────────────
// ADDRESS BOOK CRUD  /api/auth/addresses
// ─────────────────────────────────────────────

// GET all addresses for current user
router.get("/auth/addresses", async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user.addresses || []);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// POST add a new address
router.post("/auth/addresses", async (req, res) => {
  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { label, street, city, state, zipCode, country, isDefault } = req.body;
    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({ error: "Street, city, state and PIN code are required" });
    }

    const newAddr = { label: label || "Home", street, city, state, zipCode, country: country || "India", isDefault: !!isDefault };

    // If this is set as default, unset all others
    if (newAddr.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }
    // If it's the first address, auto-set as default
    if (user.addresses.length === 0) newAddr.isDefault = true;

    user.addresses.push(newAddr);

    // Sync legacy address field with the default address
    const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
    if (def) user.address = { street: def.street, city: def.city, state: def.state, zipCode: def.zipCode, country: def.country };

    await user.save();
    return res.status(201).json(user.addresses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add address" });
  }
});

// PUT update an existing address OR set it as default
router.put("/auth/addresses/:addrId", async (req, res) => {
  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const addr = user.addresses.id(req.params.addrId);
    if (!addr) return res.status(404).json({ error: "Address not found" });

    const { label, street, city, state, zipCode, country, isDefault, setDefault } = req.body;

    if (setDefault) {
      // Only change the default flag, keep fields intact
      user.addresses.forEach(a => { a.isDefault = false; });
      addr.isDefault = true;
    } else {
      if (label !== undefined) addr.label = label;
      if (street !== undefined) addr.street = street;
      if (city !== undefined) addr.city = city;
      if (state !== undefined) addr.state = state;
      if (zipCode !== undefined) addr.zipCode = zipCode;
      if (country !== undefined) addr.country = country;
      if (isDefault) {
        user.addresses.forEach(a => { a.isDefault = false; });
        addr.isDefault = true;
      }
    }

    // Sync legacy address field
    const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
    if (def) user.address = { street: def.street, city: def.city, state: def.state, zipCode: def.zipCode, country: def.country };

    await user.save();
    return res.json(user.addresses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update address" });
  }
});

// DELETE an address by its _id
router.delete("/auth/addresses/:addrId", async (req, res) => {
  const token = req.cookies[USER_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const addr = user.addresses.id(req.params.addrId);
    if (!addr) return res.status(404).json({ error: "Address not found" });

    const wasDefault = addr.isDefault;
    addr.deleteOne();

    // If deleted address was default, promote the first remaining address
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    // Sync legacy address
    const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
    user.address = def
      ? { street: def.street, city: def.city, state: def.state, zipCode: def.zipCode, country: def.country }
      : { street: "", city: "", state: "", zipCode: "", country: "" };

    await user.save();
    return res.json(user.addresses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete address" });
  }
});
// 8. Newsletter Subscription (POST /api/subscribe)
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: "This email is already subscribed!" });
    }

    // Save new subscriber
    await Subscriber.create({ email: normalizedEmail });

    // Send confirmation email
    sendEmail(normalizedEmail, "Welcome to the ARAQ Circle!", getSubscriptionEmailTemplate());

    return res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ error: "Failed to process subscription. Please try again." });
  }
});

module.exports = router;

