const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

// Load models
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Banner = require("../models/Banner");
const Seo = require("../models/Seo");
const Setting = require("../models/Setting");
const Subscriber = require("../models/Subscriber");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/bloom"; // database name this is bloom
  try {
    await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected to ${mongoURI}`);
    await seedInitialData();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  const dataDir = path.join(__dirname, "..", "..", "client", "data");

  try {
    // 1. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding products...");
      const productsData = JSON.parse(await fs.readFile(path.join(dataDir, "products.json"), "utf-8"));
      await Product.insertMany(productsData);
      console.log("Products seeded successfully.");
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log("Seeding categories...");
      const categoriesData = JSON.parse(await fs.readFile(path.join(dataDir, "categories.json"), "utf-8"));
      await Category.insertMany(categoriesData);
      console.log("Categories seeded successfully.");
    }

    // 3. Seed Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log("Seeding orders...");
      const ordersData = JSON.parse(await fs.readFile(path.join(dataDir, "orders.json"), "utf-8"));
      await Order.insertMany(ordersData);
      console.log("Orders seeded successfully.");
    }

    // 4. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding users...");
      const usersData = JSON.parse(await fs.readFile(path.join(dataDir, "users.json"), "utf-8"));
      await User.insertMany(usersData);
      console.log("Users seeded successfully.");
    }

    // 5. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log("Seeding blog posts...");
      const blogsData = JSON.parse(await fs.readFile(path.join(dataDir, "blog.json"), "utf-8"));
      await Blog.insertMany(blogsData);
      console.log("Blogs seeded successfully.");
    }

    // 6. Seed Banners (homepage)
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      console.log("Seeding homepage banners...");
      const bannersData = JSON.parse(await fs.readFile(path.join(dataDir, "homepage.json"), "utf-8"));
      await Banner.insertMany(bannersData);
      console.log("Banners seeded successfully.");
    }


    const seoCount = await Seo.countDocuments();
    if (seoCount === 0) {
      console.log("Seeding SEO settings...");
      const seoData = JSON.parse(await fs.readFile(path.join(dataDir, "seo.json"), "utf-8"));
      await Seo.create(seoData);
      console.log("SEO settings seeded successfully.");
    }

    // 8. Seed Settings
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      console.log("Seeding store settings...");
      const settingsData = JSON.parse(await fs.readFile(path.join(dataDir, "settings.json"), "utf-8"));
      await Setting.create(settingsData);
      console.log("Settings seeded successfully.");
    }

  } catch (error) {
    console.warn("Seeding initial data skipped/failed:", error.message);
  }
};

module.exports = connectDB;
