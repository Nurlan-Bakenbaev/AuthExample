import mongoose from "mongoose";

const connectDB = async (MONGO_DB) => {
  try {
    const connection = await mongoose.connect(MONGO_DB);
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
