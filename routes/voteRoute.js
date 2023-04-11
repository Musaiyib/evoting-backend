import express from "express";
import { GetAllVoters, GetVoter, NewVoter, Vote, loginVoter } from "../controllers/voteController.js";
const voteRoute = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";

voteRoute.route("/").post(Vote);
voteRoute.route("/login").post(loginVoter);
voteRoute.route("/get/voter").post( GetVoter);
voteRoute.route("/get/all").get( GetAllVoters);
voteRoute.route("/new/voter").post(requireAuth, NewVoter);

export default voteRoute;