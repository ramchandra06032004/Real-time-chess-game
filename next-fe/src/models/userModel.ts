import mongoose, { Schema } from "mongoose";

const userModel = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  Game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
  },
  isGameIncomplete: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  expiryTimeOTP: {
    type: Date,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userModel);
export default User;
