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

    const voter = await VoterModel.findOne({ regNo: regNo })
    
    if (!voter) {
      return res.status(404).json({msg: `Can't find user with this registration number: ${regNo}`})
    }

    if (voter.voted){
      return res.status(400).json({ msg: "You have already voted" });
    }

    // Check if votePin is used
    const votePinExists = await VoteModel.findOne({ votePin });
    if (votePinExists) {
      return res.status(400).json({ msg: "Vote token already used" });
    }


     // Filtering out positions with null values and creating an array of candidates with only the key and _id
    const votedCandidates = []
    const candidatesArray = Object.keys(candidates)
      .filter((position) => {
        if(candidates[position])
          return candidates[position]
        else
          votedCandidates.push({ [position]: null });
          return { [position]: null };
      })
      .map(async (position) => {
        if (candidates[position] !== null) {
          const candidateId = candidates[position]._id;
          const candidate = await CandidateModel.findById(candidateId);
          if (candidate) {
            candidate.votes += 1;
            await candidate.save();
            votedCandidates.unshift({
              [position]: {
                _id: candidateId,
                name: candidate.name,
              },
            });
            return {
              [position]: {
                _id: candidateId,
                name: candidate.name,
              },
            };
          } else {
            votedCandidates.push({ [position]: null });
            return { [position]: null };
          }
        } else {
          votedCandidates.push({ [position]: null });
          return { [position]: null };
        }
      });
    
    // Waiting for all promises to resolve
    await Promise.all(candidatesArray);

    //Updating voter voted status
    voter.voted = true
    await voter.save();

    // Creating a new vote document using the VoteModel.create method
    const votes = await VoteModel.create({
      regNo,
      votePin,
      candidates: votedCandidates,
    });

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
