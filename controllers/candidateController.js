const bcrypt = require("bcryptjs");
const Candidate = require("../models/candidateModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const EmailValidator = require("email-validator");

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
const handleNewCandidate = asyncHandler(async (req, res) => {
  const { name, nickname, regNo, level, phone } = req.body;
  if (!name || !nickname || !regNo || !level || !phone)
    return res.status(400).json("All fields are required");

  // check if user exist in database
  const duplicate = await Candidate.findOne({ regNo });
  if (duplicate)
    return res.status(409).json(`Candidate with ${regNo} already exist`);

  try {
    // encrypting the password

    //create and store new user
    const createUser = await Candidate.create({
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
    res.status(400).json("Unable to create candidate");
  }
});

// get all candidates
const getCandidates = asyncHandler(async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to get candidate");
  }
});

//update user
const updateCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const candidate = await Candidate.findById(id);

  if (!candidate) {
    res.status(404).json("Unable to find this candidate");
  }

  const { name, nickname, regNo, level, phone } = req.body;
  try {
    const update = await Candidate.findByIdAndUpdate(
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
const deleteCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    await Candidate.findByIdAndDelete(id);
    res.status(200).json("Candidate has been delete successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Unable to delete candidate");
  }
});

const vote = asyncHandler(async (req, res) => {
  const { name, nickname, regNo, level, phone } = req.body;
  if (!name || !nickname || !regNo || !level || !phone)
    return res.status(400).json("All fields are required");

  // check if user exist in database
  const duplicate = await Candidate.findOne({ regNo });
  if (duplicate)
    return res.status(409).json(`Candidate with ${regNo} already exist`);

  try {
    // encrypting the password

    //create and store new user
    const createUser = await Candidate.create({
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

module.exports = {
  getCandidates,
  handleNewCandidate,
  updateCandidate,
  deleteCandidate,
  vote,
};
