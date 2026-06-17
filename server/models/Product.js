const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 20 },
  mfgDate: { type: String },
  expiryDate: { type: String }
});

// Auto-increment ID hook
ProductSchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
