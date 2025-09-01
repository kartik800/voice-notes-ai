import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    // if env don't work you can directly paste the url here
    // "mongodb://127.0.0.1:27017/voice_notes"
    await mongoose.connect(
      process.env.MONGO_URI
    );
    console.log("connected to database");
  } catch (e) {
    console.log("error connecting to mongodb", e.message);
  }
};

export default connectToMongoDB;
