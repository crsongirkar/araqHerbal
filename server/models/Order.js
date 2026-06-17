const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const OrderSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  status: { type: String, default: "Pending" } // Pending, Shipped, Delivered, Cancelled
});

// Auto-increment ID hook
OrderSchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1001; // start orders from 1001
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
