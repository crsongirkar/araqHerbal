const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String }
});

// Auto-increment ID hook
CategorySchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
