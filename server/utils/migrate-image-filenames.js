const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const productsJsonPath = path.join(__dirname, "..", "..", "client", "data", "products.json");
const homepageJsonPath = path.join(__dirname, "..", "..", "client", "data", "homepage.json");

const Product = require("../models/Product");
const Banner = require("../models/Banner");

// Connect to production 'bloom' database
const dbUri = "mongodb+srv://crsongirkar2_db_user:cZoQZ8rYLI1rTK3b@cluster0.cdgplp0.mongodb.net/bloom?retryWrites=true&w=majority&appName=Cluster0";

async function runMigration() {
  await mongoose.connect(dbUri);
  console.log("Connected to production database.");

  const renameMapping = {}; // oldFilename -> newFilename

  const checkAndMap = (imgUrl) => {
    if (imgUrl && !imgUrl.startsWith("http")) {
      const filename = imgUrl.replace(/^\/?uploads\//, "");
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      if (base.includes(".")) {
        const newBase = base.replace(/\./g, "_");
        renameMapping[imgUrl] = `/uploads/${newBase}${ext}`;
      }
    }
  };

  // Build mapping from Products
  const dbProducts = await Product.find({});
  for (const prod of dbProducts) {
    checkAndMap(prod.image);
    if (prod.images) {
      prod.images.forEach(checkAndMap);
    }
  }

  // Build mapping from Banners
  const dbBanners = await Banner.find({});
  for (const banner of dbBanners) {
    checkAndMap(banner.image);
  }

  console.log("Constructed Rename Mapping:", JSON.stringify(renameMapping, null, 2));

  // Update products.json
  if (fs.existsSync(productsJsonPath)) {
    let productsJson = fs.readFileSync(productsJsonPath, "utf-8");
    for (const [oldUrl, newUrl] of Object.entries(renameMapping)) {
      productsJson = productsJson.replaceAll(oldUrl, newUrl);
    }
    fs.writeFileSync(productsJsonPath, productsJson, "utf-8");
    console.log("Updated products.json.");
  }

  // Update homepage.json
  if (fs.existsSync(homepageJsonPath)) {
    let homepageJson = fs.readFileSync(homepageJsonPath, "utf-8");
    for (const [oldUrl, newUrl] of Object.entries(renameMapping)) {
      homepageJson = homepageJson.replaceAll(oldUrl, newUrl);
    }
    fs.writeFileSync(homepageJsonPath, homepageJson, "utf-8");
    console.log("Updated homepage.json.");
  }

  // Update Products in DB
  for (const prod of dbProducts) {
    let modified = false;
    if (renameMapping[prod.image]) {
      prod.image = renameMapping[prod.image];
      modified = true;
    }
    if (prod.images && prod.images.length > 0) {
      prod.images = prod.images.map(img => {
        if (renameMapping[img]) {
          modified = true;
          return renameMapping[img];
        }
        return img;
      });
    }
    if (modified) {
      await prod.save();
      console.log(`Updated DB Product: ${prod.name}`);
    }
  }

  // Update Banners in DB
  for (const banner of dbBanners) {
    if (renameMapping[banner.image]) {
      banner.image = renameMapping[banner.image];
      await banner.save();
      console.log(`Updated DB Banner: ${banner.title}`);
    }
  }

  await mongoose.disconnect();
  console.log("Migration complete!");
}

runMigration().catch(console.error);
