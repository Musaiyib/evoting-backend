import mongoose from "mongoose";
const { Schema } = mongoose;
import { CandidateModel } from "./candidateModel.js";
const VoteSchema = new Schema({
  regNo: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: async function (regNo) {
        let votePin = (await VoterModel.findOne({ regNo }, " votePin "))
          .votePin;
        return await validRegNo(regNo, votePin);
      },
    },
  },
  votePin: {
    type: Number,
    unique: true,
    required: true,
    minLength: 9,
    maxLength: 9,
    validate: {
      validator: async function (votePin) {
        let regNo = (await VoterModel.findOne({ votePin }, " regNo ")).regNo;
        return await validVotePin(votePin, regNo);
      },
    },
  },
  candidate: {
    type: String,
    required: true,
    validate: {
      validator: async function (candidate) {
        return await validCandidate(candidate);
      },
    },
  },
  createdAt: {
    type: Date,
    default: new Date(
      new Date().toLocaleString("en", { timeZone: "Africa/Lagos" })
    ),
  },
});

export const VoteModel = mongoose.model("Vote", VoteSchema);

const VoterSchema = new Schema({
  regNo: { type: String, unique: true, required: true },
  votePin: {
    type: Number,
    unique: true,
    required: true,
    minLength: 9,
    maxLength: 9,
  },
  level: { type: Number, min: 100, max: 400 },
  createdAt: {
    type: Date,
    default: new Date(
      new Date().toLocaleString("en", { timeZone: "Africa/Lagos" })
    ),
  },
  phone: {
    type: String,
    unique: true,
    minLength: 11,
    maxLength: 11,
    required: true,
  },
});

export const VoterModel = mongoose.model("Voter", VoterSchema);

async function validCandidate(candidate) {
  if (!(await CandidateModel.findOne({ nickname: candidate }))) return false;
  return true;
}

async function validRegNo(regNo, votePin) {
  if (!(await VoterModel.findOne({ regNo, votePin }))) return false;
  return true;
}

async function validVotePin(votePin, regNo) {
  if (!(await VoterModel.findOne({ votePin, regNo }))) return false;
  return true;
}
