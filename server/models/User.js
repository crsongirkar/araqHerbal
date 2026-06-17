const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  label: { type: String, default: "Home" }, // e.g. Home, Work, Other
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, default: "Customer" }, // Customer, Administrator
  phone: { type: String, default: "" },
  // Legacy single address (kept for backward compat with checkout session)
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  // New multi-address book
  addresses: { type: [AddressSchema], default: [] },
  joinDate: { type: String, default: () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  status: { type: String, default: "Active" } // Active, Suspended
});

// Auto-increment ID hook
UserSchema.pre("save", async function(next) {
  if (this.isNew && !this.id) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { id: -1 } });
    this.id = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);

