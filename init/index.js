const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Item = require("../models/sareeData.js");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chanchalSaree1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

async function initDB() {
  try {
    // Clear existing documents
    await Item.deleteMany({});
    console.log("Cleared existing items");

    // Extract raw data
    let raw;
    if (Array.isArray(initData.myCollections)) {
      raw = initData.myCollections;
    } else if (
      typeof initData.myCollections === "object" &&
      initData.myCollections !== null
    ) {
      raw = Object.values(initData.myCollections).flat();
    } else {
      throw new Error("initData.myCollections is not valid");
    }

    // Map to schema fields
    const documents = raw.map(obj => ({
      itemName: obj.itemName,
      price: obj.price,
      image: {
        url: obj.image?.url || "",
        fileName: obj.image?.fileName || "",
      },
      type: obj.type,
    }));

    if (documents.length === 0) {
      console.warn("No documents to insert; raw data is empty");
    } else {
      await Item.insertMany(documents);
      console.log(`Inserted ${documents.length} documents`);
    }
  } catch (err) {
    console.error("Error in initDB:", err);
    throw err;
  }
}

async function main() {
  try {
    await connectDB();
    await initDB();
  } catch (err) {
    console.error("Initialization failed:", err);
    process.exit(1);
  } finally {
    try {
      await mongoose.connection.close();
      console.log("Database connection closed");
    } catch (closeErr) {
      console.error("Error closing connection:", closeErr);
    }
  }
}

main();
