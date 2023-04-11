import mongoose from "mongoose";

const CandidateSchema = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "user",
    // },
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      default: 0,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { type: Number, default: Date.now() },
  }
);

export const CandidateModel = mongoose.model("Candidate", CandidateSchema);
