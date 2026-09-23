const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const images = {
  Smartphone:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",

  Laptop:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80",

  Headphones:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",

  "Smart Watch":
    "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=500&q=80"
};

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    for (const [name, image] of Object.entries(images)) {
      await Product.updateOne(
        { name },
        { $set: { image } }
      );

      console.log(`${name} image updated ✅`);
    }

    console.log("All images fixed successfully 🎉");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error ❌", error);
  }
}

fixImages();