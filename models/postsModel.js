import { required } from "joi";
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    desc: { type: String, trim: true, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
