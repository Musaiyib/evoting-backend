import bcrypt from "bcryptjs";
import { CandidateModel } from "../models/candidateModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import EmailValidator from "email-validator";
import { RolesModel } from "../models/rolesModel.js";

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
export const AddCandidate = asyncHandler(async (req, res) => {
  const { name, nickname, regNo, level, phone, position } = req.body;
  if (!name || !nickname || !regNo || !level || !phone || !position)
    return res.status(400).json({msg:"All fields are required"});

  // check if user exist in database
  const duplicate = await CandidateModel.findOne({ regNo });
  if (duplicate)
    return res.status(409).json({msg:`Candidate with ${regNo} already exist`});

  try {
    //create and store new user
    const createUser = await CandidateModel.create({
      name,
      nickname,
      regNo,
      level,
      phone,
      position,
    });

    if (createUser) {
      return res.status(201).json({msg: 'Candidate is successfully added', data: createUser});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({msg:"Unable to create candidate"});
  }
});

// get all candidates
export const getCandidates = asyncHandler(async (req, res) => {
  try {
    const roles = await RolesModel.findOne({ _id: 'roles' });
    const candidates = await CandidateModel.find();
    const sortedCandidates = {};
    roles.items.forEach((role) => {
      sortedCandidates[role] = candidates.filter((candidate) => candidate.position === role.toLowerCase());
    });
    res.status(200).json({data: sortedCandidates});
  } catch (error) {
    console.error(error.message)
    res.status(500).json({msg:"Unable to get candidate"});
  }
});

//update user
export const updateCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const candidate = await CandidateModel.findById(id);

  if (!candidate) {
    res.status(404).json({msg:"Unable to find this candidate"});
  }

  const { name, nickname, regNo, level, phone, position } = req.body;
  try {
    const update = await CandidateModel.findByIdAndUpdate(
      id,
      {
        name,
        nickname,
        regNo,
        level,
        phone,
        position,
      },
      {
        new: true,
      }
    );
    res.status(200).json({msg:"Candidate has successfully updated"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Unable to update candidate"});
  }
});

//delete user
export const deleteCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    await CandidateModel.findByIdAndDelete(id);
    res.status(200).json({msg:"Candidate has been delete successfully"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({msg:"Unable to delete candidate"});
  }
});