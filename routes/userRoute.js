import express from "express";
import {
  AddCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
} from "../controllers/candidateController.js";
import {
  handleNewUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
  getMe,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const userRoute = express.Router();

// get/login elcom
userRoute.route("/").get(requireAuth, getMe).post(login);

userRoute.route("/allusers").get(getUsers);

// registering elcom
userRoute.route("/register").post(handleNewUser);

// modifying/deleting elcom
userRoute
  .route("/:id")
  .put(requireAuth, updateUser)
  .delete(requireAuth, deleteUser);

// registering candidate
userRoute.route("/register/candidate").post(AddCandidate);
userRoute.route("/candidates").get(getCandidates);

// modifying/deleting candidate
userRoute
  .route("/candidate/:id")
  .put(requireAuth, updateCandidate)
  .delete(requireAuth, deleteCandidate);
export default userRoute;
