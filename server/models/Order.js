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
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  status: { type: String, default: "Pending" } 
});


OrderSchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
      uniqueId = Math.floor(100000000000 + Math.random() * 900000000000);
      const existing = await this.constructor.findOne({ id: uniqueId });
      if (!existing) {
        isUnique = true;
      }
    }
    this.id = uniqueId;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
