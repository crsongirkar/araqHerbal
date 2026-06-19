const mongoose = require("mongoose");

const dbUri = "mongodb+srv://crsongirkar2_db_user:cZoQZ8rYLI1rTK3b@cluster0.cdgplp0.mongodb.net/bloom?retryWrites=true&w=majority&appName=Cluster0";

const bannerSchema = new mongoose.Schema({
  id: Number,
  tagline: String,
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  image: String,
  bgClass: String
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

async function checkBanners() {
  await mongoose.connect(dbUri);
  console.log("Connected to production database.");

  const banners = await Banner.find({});
  console.log("Banners in production DB:");
  console.log(JSON.stringify(banners.map(b => ({
    id: b.id,
    title: b.title,
    imageLength: b.image ? b.image.length : 0,
    imageStart: b.image ? b.image.substring(0, 100) : null
  })), null, 2));

  mongoose.connection.close();
}

checkBanners().catch(console.error);
