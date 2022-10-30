import { Router } from "express";
import { handleNewCandidate, updateCandidate, deleteCandidate, getCandidates, vote } from "../controllers/candidateController.js";
const candidateRoute = Router();
import { requireAuth } from "../middleware/authMiddleware.js";

// Voter candidate routes
// candidateRoute.route("/vote").post(vote);

//Elcom candidate routes
// registering candidate
candidateRoute.route("/register").post(handleNewCandidate);
candidateRoute.route("/all").get(getCandidates);
// modifying/deleting candidate
candidateRoute.route("/:id").put(updateCandidate).delete(deleteCandidate);
export default candidateRoute;
