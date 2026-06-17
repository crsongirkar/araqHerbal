const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  author: { type: String, default: "Admin" },
  category: { type: String, default: "General" },
  tags: { type: [String], default: [] },
  status: { type: String, default: "draft" }, // published, draft
  date: { type: String, default: () => new Date().toISOString().split("T")[0] }
});

// Auto-increment ID hook
BlogSchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
