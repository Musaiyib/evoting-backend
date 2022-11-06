import { Router } from "express";
import {
  handleNewCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
  vote,
} from "../controllers/candidateController.js";
const candidateRoute = Router();
import { requireAuth } from "../middleware/authMiddleware.js";

//Elcom candidate routes
// registering candidate
candidateRoute.route("/").get(requireAuth, getCandidates);
candidateRoute.route("/register").post(requireAuth, handleNewCandidate);
// modifying/deleting candidate
candidateRoute
  .route("/:id")
  .put(requireAuth, updateCandidate)
  .delete(deleteCandidate);
export default candidateRoute;
