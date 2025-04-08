import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/my_database";

export const connectDB = async () => {
  if (mongoose.connection.readyState > 0) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", (error as Error).message);
    process.exit(1);
  }
};
