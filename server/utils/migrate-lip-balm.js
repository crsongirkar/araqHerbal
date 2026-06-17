const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

async function migrate() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/bloom";
  console.log(`Connecting to database at ${mongoUri}...`);
  
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // 1. Update Product
    console.log("Updating Products...");
    const productResult = await Product.updateMany(
      { name: "Lib Bam" },
      { $set: { name: "Lip Balm" } }
    );
    console.log(`Updated ${productResult.modifiedCount} product(s).`);

    // 2. Update Orders
    console.log("Updating Orders...");
    const orderResult = await Order.updateMany(
      { "items.name": "Lib Bam" },
      { $set: { "items.$[elem].name": "Lip Balm" } },
      { arrayFilters: [{ "elem.name": "Lib Bam" }] }
    );
    console.log(`Updated ${orderResult.modifiedCount} order(s).`);

    console.log("Migration finished successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

migrate();
