import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Simple, clean connection string with updated SSL behavior
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
