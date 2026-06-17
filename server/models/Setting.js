const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  storeName: { type: String, default: "ARAQ Herbal" },
  storeTagline: { type: String, default: "Pure. Natural. Handcrafted." },
  storeEmail: { type: String, default: "hello@araqherbal.com" },
  storePhone: { type: String, default: "9900303003" },
  storeAddress: { type: String, default: "123 Botanical Lane, Green City, CA 94102" },
  currency: { type: String, default: "INR" },
  currencySymbol: { type: String, default: "₹" },
  taxRate: { type: Number, default: 0.08 },
  shippingFee: { type: Number, default: 5.99 },
  freeShippingThreshold: { type: Number, default: 50 },
  lowStockThreshold: { type: Number, default: 10 },
  logo: { type: String, default: "" },
  favicon: { type: String, default: "" },
  socialInstagram: { type: String, default: "" },
  socialFacebook: { type: String, default: "" },
  socialTwitter: { type: String, default: "" }
});

module.exports = mongoose.model("Setting", SettingSchema);
