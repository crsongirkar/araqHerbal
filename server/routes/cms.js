const express = require("express");
const router = express.Router();

// Load models
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Banner = require("../models/Banner");
const Seo = require("../models/Seo");
const Setting = require("../models/Setting");

/* =========================================================================
   PRODUCTS ROUTING (/api/products)
   ========================================================================= */

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    // Ensure default values are returned for stock/rating/reviewCount
    const formatted = products.map(p => ({
      ...p.toObject(),
      stock: p.stock !== undefined ? p.stock : 100,
      rating: p.rating !== undefined ? p.rating : 4.5,
      reviewCount: p.reviewCount !== undefined ? p.reviewCount : 20
    }));
    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load products" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const body = req.body;
    const newProduct = new Product({
      name: body.name,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      category: body.category || "Body Care",
      image: body.image,
      images: body.images || [],
      description: body.description || "",
      stock: body.stock !== undefined ? parseInt(body.stock) : 100,
      rating: body.rating ? parseFloat(body.rating) : 4.5,
      reviewCount: body.reviewCount ? parseInt(body.reviewCount) : Math.floor(Math.random() * 80) + 20,
      mfgDate: body.mfgDate,
      expiryDate: body.expiryDate
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add product" });
  }
});

router.put("/products", async (req, res) => {
  try {
    const { id, ...updatedFields } = req.body;
    if (!id) return res.status(400).json({ error: "Product ID is required" });

    const product = await Product.findOne({ id: parseInt(id) });
    if (!product) return res.status(404).json({ error: "Product not found" });

    Object.assign(product, updatedFields);
    if (updatedFields.price !== undefined) product.price = parseFloat(updatedFields.price);
    if (updatedFields.originalPrice !== undefined) {
      product.originalPrice = updatedFields.originalPrice ? parseFloat(updatedFields.originalPrice) : undefined;
    }
    if (updatedFields.stock !== undefined) product.stock = parseInt(updatedFields.stock);

    await product.save();
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Product ID is required" });

    const result = await Product.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

/* =========================================================================
   CATEGORIES ROUTING (/api/categories)
   ========================================================================= */

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    const products = await Product.find({});
    
    const withCounts = categories.map(c => ({
      ...c.toObject(),
      productCount: products.filter(p => p.category === c.name).length
    }));
    return res.json(withCounts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const newCat = new Category({ name: name.trim(), slug, description: description || "" });
    await newCat.save();
    return res.status(201).json(newCat);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/categories", async (req, res) => {
  try {
    const { id, ...fields } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });

    const category = await Category.findOne({ id: parseInt(id) });
    if (!category) return res.status(404).json({ error: "Category not found" });

    Object.assign(category, fields);
    if (fields.name) {
      category.slug = fields.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    await category.save();
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID required" });

    const result = await Category.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

/* =========================================================================
   ORDERS ROUTING (/api/orders)
   ========================================================================= */

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load orders" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const body = req.body;
    const items = body.items || [];

    // 1. Validate stock level for all items in order
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      if (!product) {
        return res.status(404).json({ error: `Product "${item.name}" not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product "${item.name}". Only ${product.stock} available.` });
      }
    }

    // 2. Decrement stock counts in database
    for (const item of items) {
      await Product.updateOne(
        { id: item.id },
        { $inc: { stock: -item.quantity } }
      );
    }

    const newOrder = new Order({
      customerName: body.customerName,
      // Always store email in lowercase so user order-history lookup always matches
      customerEmail: (body.customerEmail || "").trim().toLowerCase(),
      items: items,
      subtotal: parseFloat(body.subtotal),
      shipping: parseFloat(body.shipping),
      tax: parseFloat(body.tax),
      total: parseFloat(body.total),
      status: "Pending"
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create order" });
  }
});

router.put("/orders", async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ error: "Order ID is required" });

    const order = await Order.findOne({ id: parseInt(id) });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const oldStatus = order.status;

    // Validate stock changes if reverting a cancelled order
    if (oldStatus === "Cancelled" && status && status !== "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findOne({ id: item.id });
        if (!product) {
          return res.status(404).json({ error: `Product "${item.name}" not found.` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Cannot restore order. Insufficient stock for "${item.name}". Only ${product.stock} available.` });
        }
      }

      // Deduct stock again
      for (const item of order.items) {
        await Product.updateOne(
          { id: item.id },
          { $inc: { stock: -item.quantity } }
        );
      }
    }
    // Restore stock if transitioning to Cancelled
    else if (status === "Cancelled" && oldStatus !== "Cancelled") {
      for (const item of order.items) {
        await Product.updateOne(
          { id: item.id },
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.status = status || order.status;
    await order.save();
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update order" });
  }
});

// POST /api/orders/track - Public endpoint to track order status
router.post("/orders/track", async (req, res) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) {
      return res.status(400).json({ error: "Order ID and Email are required." });
    }

    const orderNum = parseInt(orderId);
    if (isNaN(orderNum)) {
      return res.status(400).json({ error: "Invalid Order ID format." });
    }

    const order = await Order.findOne({
      id: orderNum,
      customerEmail: email.trim().toLowerCase()
    });

    if (!order) {
      return res.status(404).json({ error: "No order found with the provided details." });
    }

    return res.json({
      id: order.id,
      customerName: order.customerName,
      date: order.date,
      status: order.status,
      items: order.items,
      total: order.total
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    return res.status(500).json({ error: "Failed to track order. Please try again." });
  }
});

/* =========================================================================
   BLOG ROUTING (/api/blog)
   ========================================================================= */

router.get("/blog", async (req, res) => {
  try {
    const posts = await Blog.find({});
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load posts" });
  }
});

router.post("/blog", async (req, res) => {
  try {
    const body = req.body;
    if (!body.title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const newPost = new Blog({
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      image: body.image || "",
      author: body.author || "Admin",
      category: body.category || "General",
      tags: body.tags || [],
      status: body.status || "draft"
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/blog", async (req, res) => {
  try {
    const { id, ...fields } = req.body;
    if (!id) return res.status(400).json({ error: "ID required" });

    const post = await Blog.findOne({ id: parseInt(id) });
    if (!post) return res.status(404).json({ error: "Post not found" });

    Object.assign(post, fields);
    await post.save();
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/blog", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID required" });

    const result = await Blog.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete post" });
  }
});

/* =========================================================================
   SEO ROUTING (/api/seo)
   ========================================================================= */

router.get("/seo", async (req, res) => {
  try {
    let seo = await Seo.findOne({});
    if (!seo) {
      seo = await Seo.create({
        title: "ARAQ — A Herbal Elixir",
        description: "Handcrafted herbal elixirs...",
        keywords: "herbal soaps, organic body bars"
      });
    }
    return res.json(seo);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load SEO settings" });
  }
});

router.put("/seo", async (req, res) => {
  try {
    const body = req.body;
    let seo = await Seo.findOne({});
    if (!seo) {
      seo = new Seo({});
    }
    seo.title = body.title;
    seo.description = body.description;
    seo.keywords = body.keywords || "";
    await seo.save();
    return res.json(seo);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save SEO settings" });
  }
});

/* =========================================================================
   SETTINGS ROUTING (/api/settings)
   ========================================================================= */

router.get("/settings", async (req, res) => {
  try {
    let setting = await Setting.findOne({});
    if (!setting) {
      setting = await Setting.create({});
    }
    return res.json(setting);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const body = req.body;
    let setting = await Setting.findOne({});
    if (!setting) {
      setting = new Setting({});
    }
    Object.assign(setting, body);
    await setting.save();
    return res.json(setting);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save settings" });
  }
});

/* =========================================================================
   USERS ROUTING (/api/users)
   ========================================================================= */

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load users" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name?.trim() || !body.email?.trim()) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existing = await User.findOne({ email: body.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = new User({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      role: body.role || "Customer",
      status: body.status || "Active"
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/users", async (req, res) => {
  try {
    const { id, ...fields } = req.body;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findOne({ id: parseInt(id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    Object.assign(user, fields);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "User ID is required" });

    const result = await User.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

/* =========================================================================
   HOMEPAGE BANNERS ROUTING (/api/homepage)
   ========================================================================= */

router.get("/homepage", async (req, res) => {
  try {
    const slides = await Banner.find({});
    return res.json(slides);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load homepage slides" });
  }
});

router.put("/homepage", async (req, res) => {
  try {
    const slides = req.body;
    if (!Array.isArray(slides)) {
      return res.status(400).json({ error: "Slides must be a valid array" });
    }

    // Overwrite all banners
    await Banner.deleteMany({});
    
    // Set numeric IDs if not present, and save
    const prepared = slides.map((slide, idx) => ({
      id: slide.id || idx + 1,
      tagline: slide.tagline,
      title: slide.title,
      description: slide.description,
      buttonText: slide.buttonText || "Shop Now",
      buttonLink: slide.buttonLink || "/shop",
      image: slide.image,
      bgClass: slide.bgClass || "bg-[#e8f5e9]"
    }));

    await Banner.insertMany(prepared);
    return res.json(prepared);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save homepage slides" });
  }
});

module.exports = router;
