import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  regNo: {
    type: String,
    lowercase: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "member",
  },
  password: {
    type: String,
    required: true,
    minLenght: 8,
  },
});

export const UserModel = mongoose.model("User", UserSchema);
