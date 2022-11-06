import { randomBytes } from "crypto";
import asyncHandler from "express-async-handler";
import { VoterModel, VoteModel } from "../models/voteModel.js";

async function randomUInt32(length) {
  const uint32 =
    randomBytes(256).readUInt32BE().toString() +
    randomBytes(256).readUInt32BE().toString();
  return parseInt(uint32.substring(0, length));
}

export const NewVoter = asyncHandler(async (req, res) => {
  try {
    let { regNo, level, phone } = req.body;
    if (!regNo || !phone || !level)
      res.status(403).json(`all fields are required`);
    const generateVoteToken = await VoterModel.create({
      regNo,
      level,
      phone,
      votePin: await randomUInt32(9),
    });
    console.log(generateVoteToken.votePin);
    const { votePin } = generateVoteToken;
    res.status(200).json({
      message: "new voter was registered successfully",
      data: { regNo, level, phone, votePin },
    });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
});

export const Vote = asyncHandler(async (req, res) => {
  try {
    let { regNo, votePin, candidate } = req.body;
    if ((!regNo || !votePin, !candidate))
      res.status(403).json(`all fields are required`);

    // check if votePin is used
    const votePinExist = await VoteModel.find({ votePin });
    if (votePinExist) {
      return res.status(400).json({ message: "Vote token already used" });
    }
    await VoteModel.create({
      regNo,
      votePin,
      candidate,
    });
    res.status(200).json("voted!");
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
});
