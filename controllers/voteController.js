import { randomBytes } from "crypto";
import asyncHandler from "express-async-handler";
import { VoterModel, VoteModel } from "../models/voteModel.js";
import { CandidateModel } from "../models/candidateModel.js";

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
      return res.status(400).json({msg: `all fields are required`});

    const findByRegNo = await VoterModel.findOne({regNo})
    if(findByRegNo)
      return res.status(409).json({msg: `We found a user with same registraion number: ${regNo}`})

    const findByPhone = await VoterModel.findOne({phone})
    if(findByPhone)
      return res.status(409).json({msg: `We found a user with same phone number: ${phone}`})

    const generateVoteToken = await VoterModel.create({
      regNo,
      level,
      phone,
      votePin: await randomUInt32(9),
    });
    const { votePin } = generateVoteToken;
    return res.status(201).json({
      msg: "new voter was registered successfully",
      data: { regNo, level, phone, votePin },
    });
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.log(error.message);
  }
});

export const GetVoter = asyncHandler(async (req, res) => {
  try {
    let { regNo, phone } = req.body;
    if (!regNo || !phone )
      return res.status(400).json({msg: `all fields are required`});

    const findByRegNo = await VoterModel.findOne({regNo: regNo})
    console.log(findByRegNo);
    if(!findByRegNo)
      return res.status(404).json({msg: `We can't find a user with this registraion number: ${regNo}`})
      
    if(findByRegNo.phone !== phone)
      return res.status(404).json({msg: `The phone number provided: ${phone} does not match the registraion number: ${regNo}`})

    return res.status(200).json({
      msg: "Voter found",
      data: {
        votePin: findByRegNo.votePin,
        regNo: findByRegNo.regNo,
        phone: findByRegNo.phone,
        level: findByRegNo.level,
        voted: findByRegNo.voted
      },
    });
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.log(error.message);
  }
});

export const GetAllVoters = asyncHandler(async (req, res) => {
  try {
    const voters = await VoterModel.find()
    return res.status(200).json({
      msg: "List of all voters",
      data: voters,
    });
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.log(error.message);
  }
});

export const Vote = asyncHandler(async (req, res) => {
  try {
    const { regNo, votePin, candidates } = req.body;

    // Check that all fields are present
    if (!regNo || !votePin || !candidates || candidates.length === 0) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if votePin is used
    const votePinExists = await VoteModel.findOne({ votePin });
    if (votePinExists) {
      return res.status(400).json({ msg: "Vote token already used" });
    }

    // Update the voted field in the VoterModel
    await VoterModel.findOneAndUpdate({ regNo: regNo }, { voted: true });

    // Create a vote for each candidate
    const votes = await Promise.all(
      Object.keys(candidates).map(async (position) => {
        const candidate = candidates[position];

        // Check if candidate exists
        if (candidate) {
          // Increment the votes count
          candidate.votes = candidate.votes + 1;

          // Save the updated candidate object
          await CandidateModel.findOneAndUpdate(
            { _id: candidate._id },
            { $set: candidate },
            { new: true }
          );

          // Update the existing vote document or create a new one
          return await VoteModel.updateOne(
            { regNo: regNo },
            { $set: { votePin: votePin, candidate: candidate._id } },
            { upsert: true }
          );
        }
        else {
          // Create a vote for the current candidate
          return await VoteModel.create({
            regNo,
            votePin,
            position
          });
        }
      })
    );

    return res.status(200).json({ msg: "Voted!", votes });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


export const loginVoter = asyncHandler(async (req, res) => {
  try {
    const { regNo, votePin } = req.body;
    if ((!regNo || !votePin))
      return res.status(400).json({msf: `all fields are required`});

    // check if votePin is used
    // if (votePinExist) {
    //   return res.status(400).json({ message: "Vote token already used" });
    // }

    const voter = await VoterModel.findOne({
      votePin
    });
    console.log(voter);
    if(voter.regNo !== regNo.toLowerCase()){
      return res.status(400).json({msg: "Invalid registration number or vote token"})
    }
    return res.status(200).json(voter);
  } catch (error) {
    res.status(500).json({msg: "internale server error"});
    console.log(error.message);
  }
});
