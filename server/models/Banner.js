const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  id: { type: Number },
  tagline: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  buttonText: { type: String, default: "Shop Now" },
  buttonLink: { type: String, default: "/shop" },
  image: { type: String },
  bgClass: { type: String, default: "bg-[#e8f5e9]" }
});

module.exports = mongoose.model("Banner", BannerSchema);
