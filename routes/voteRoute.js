import express from "express";
import { NewVoter, Vote } from "../controllers/voteController.js";
const voteRoute = express.Router();
import { requireAuth } from "../middleware/authMiddleware.js";

voteRoute.route("/").post(Vote);
voteRoute.route("/new/voter").post(requireAuth, NewVoter);

export default voteRoute;