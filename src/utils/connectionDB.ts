import mongoose from "mongoose";
const connectioDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

export default connectioDB;
