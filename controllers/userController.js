import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
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
export const handleNewUser = asyncHandler(async (req, res) => {
  const { email, password, name, role, regNo } = req.body;
  if (!email || !password || !name || !role || !regNo)
    return res.status(400).json({ msg: "All are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json({msg: "Invalid email"});
  }

  // check if user exist in database
  const emailDuplicate = await UserModel.findOne({ email });
  if (emailDuplicate) return res.status(409).json({msg: "User already exist"});
  const regNoDuplicate = await UserModel.findOne({ regNo });
  if (regNoDuplicate) return res.status(409).json({msg: "User already exist"});

  try {
    // encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    //create and store new user
    const createUser = await UserModel.create({
      email,
      regNo,
      password: hashedPwd,
      name,
      role,
    });

    if (createUser) {
      return res.status(201).json({
        msg: `${createUser.role} is create successful`,
        data: {
          _id: createUser._id,
          name: createUser.name,
          email: createUser.email,
          role: createUser.role,
          regNo: createUser.regNo,
          token: generateToken(createUser._id, createUser.role)
        }
      });
    }
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

//login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
  return res.status(400).json({ msg: "Email and password are required" });
  
  try {
    // validating email
    if (validateEmail(email) === false) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    //check if user exist
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ msg: `User with this email is: ${email} not found` });

    //validating user password
    const validatePassword = await bcrypt.compare(password, user.password);

    //log user in
    if (validatePassword) {
      return res.status(200).json({
        msg: "Login successful",
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          regNo: user.regNo,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      return res.status(409).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

// get me
export const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  try{res.status(200).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    regNo: user.regNo,
  });
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

//get all users
export const getUsers = asyncHandler(async (req, res) => {
  try {
    
    const users = await UserModel.find().select('-password');
    res.status(200).json( users );
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

//update user
export const updateUser = asyncHandler(async (req, res) => {
  try{const id = req.params.id;
  // const user = await User.findById(id);
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role)
    return res.status(400).json({ msg: "All are required" });

  // validating email
  if (validateEmail(email) === false) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  if (!req.user) {
    res.status(404).json({ msg: "User not found" });
  }

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json({ msg: "User not authorized" });
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

  res.status(200).json({msg: "User updatad successfully" ,data: { _id: update._id, email: update.email, name: update.name }});
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

//delete user
export const deleteUser = asyncHandler(async (req, res) => {
  try{const id = req.params.id;

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(401).json({ msg: "User not authorized" });
  }

  if (!req.user) {
    res.status(404).json({ msg: "User not found" });
  }
  await req.user.remove();
  // const users = await User.find();
    res.status(200).json({msg: `User with ${req.user.email} has been deleted successfully`});
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});
