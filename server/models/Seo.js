const mongoose = require("mongoose");

const SeoSchema = new mongoose.Schema({
  title: { type: String, default: "ARAQ — A Herbal Elixir" },
  description: { type: String, default: "Handcrafted herbal elixirs, natural body bars, and botanical skin remedies." },
  keywords: { type: String, default: "herbal soaps, organic body bars" }
});

module.exports = mongoose.model("Seo", SeoSchema);
