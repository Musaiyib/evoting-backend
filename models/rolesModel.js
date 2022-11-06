import mongoose from "mongoose";

const { Schema } = mongoose;

const RolesSchema = new Schema({
  _id: String,
  items: [],
});

export const RolesModel = mongoose.model("Role", RolesSchema);
