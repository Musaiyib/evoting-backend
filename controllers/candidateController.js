import bcrypt from "bcryptjs";
import { CandidateModel } from "../models/candidateModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import EmailValidator from "email-validator";

// generating token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const validateEmail = (val) => {
  return EmailValidator.validate(val);
};

// register user
export const handleNewCandidate = asyncHandler(async (req, res) => {
  const { name, nickName, regNo, level, phone, position } = req.body;
  console.log(req.body);
  if (!name || !nickName || !regNo || !level || !phone || !position)
    return res.status(400).json("All fields are required");

  // check if user exist in database
  const duplicate = await CandidateModel.findOne({ regNo });
  if (duplicate)
    return res.status(409).json(`Candidate with ${regNo} already exist`);

  try {
    //create and store new user
    const createUser = await CandidateModel.create({
      name,
      nickname: nickName,
      regNo,
      level: JSON.parse(level),
      phone,
      position,
    });

    if (createUser) {
      return res.status(201).json(createUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to create candidate");
  }
});

// get all candidates
export const getCandidates = asyncHandler(async (req, res) => {
  try {
    const candidates = await CandidateModel.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to get candidate");
  }
});

//update user
export const updateCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const candidate = await CandidateModel.findById(id);

  if (!candidate) {
    res.status(404).json("Unable to find this candidate");
  }

  const { name, nickname, regNo, level, phone } = req.body;
  try {
    const update = await CandidateModel.findByIdAndUpdate(
      id,
      {
        name,
        nickname,
        regNo,
        level,
        phone,
      },
      {
        new: true,
      }
    );
    res.status(200).json("Candidate has successfully updated");
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to update candidate");
  }
});

//delete user
export const deleteCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    await CandidateModel.findByIdAndDelete(id);
    res.status(200).json("Candidate has been delete successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to delete candidate");
  }
});

export const vote = asyncHandler(async (req, res) => {
  const { name, nickname, regNo, level, phone } = req.body;
  if (!name || !nickname || !regNo || !level || !phone)
    return res.status(400).json("All fields are required");

  // check if user exist in database
  const duplicate = await CandidateModel.findOne({ regNo });
  if (duplicate)
    return res.status(409).json(`Candidate with ${regNo} already exist`);

  try {
    // encrypting the password

    //create and store new user
    const createUser = await CandidateModel.create({
      name,
      nickname,
      regNo,
      level,
      phone,
    });

    if (createUser) {
      return res.status(201).json(createUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to vote candidate");
  }
});

// module.exports.default = {
//   getCandidates,
//   handleNewCandidate,
//   updateCandidate,
//   deleteCandidate,
//   vote,
// };
