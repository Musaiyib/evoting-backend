const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
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
const handleNewUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json("Email, name and password are required");

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }
  // check if user exist in database
  const duplicate = await User.findOne({ email });
  if (duplicate) return res.status(409).json("User already exist");

  try {
    // encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    //create and store new user
    const createUser = await User.create({
      email: email,
      password: hashedPwd,
      name: name,
    });

    if (createUser) {
      return res.status(201).json({
        _id: createUser._id,
        name: createUser.name,
        email: createUser.email,
        token: generateToken(createUser._id, createUser.role),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }

  //check if user exist
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: `User with this email is: ${email} not found` });

  try {
    //validating user password
    const validatePassword = await bcrypt.compare(password, user.password);

    //log user in
    if (validatePassword) {
      
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id, user.role),
      });
    } else {
      return res.status(409).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

// get me
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    _id: _id,
    name,
    email,
  });
});

//get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // const user = await User.findById(id);
  const { email, password, name } = req.body;

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json("Invalid email");
  }

  if (!req.user) {
    res.status(404).json({ message: "User not found" });
  }

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json("User not authorized");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  const update = await User.findByIdAndUpdate(
    id,
    { email, name, password: hashedPwd },
    {
      new: true,
    }
  );
  // const users = await User.find();

  res
    .status(200)
    .json({ _id: update._id, email: update.email, name: update.name });
  // res.status(200).json({ _id: update._id, email: user.email, name: user.name });
});

//delete user
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json("User not authorized");
  }

  if (!req.user) {
    res.status(404).json("User not found");
  }
  await req.user.remove();
  // const users = await User.find();
  res
    .status(200)
    .json(`User with ${req.user.email} has been deleted successfully`);
});

module.exports = {
  handleNewUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
  getMe,
};
