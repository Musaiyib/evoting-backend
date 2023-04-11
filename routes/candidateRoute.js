import { Router } from "express";
import {
  AddCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
} from "../controllers/candidateController.js";
const candidateRoute = Router();
import { requireAuth } from "../middleware/authMiddleware.js";

//Elcom candidate routes
// registering candidate
candidateRoute.route("/").get(getCandidates);
candidateRoute.route("/register").post(AddCandidate);
// modifying/deleting candidate
candidateRoute
  .route("/:id")
  .put(requireAuth, updateCandidate)
  .delete(deleteCandidate);
export default candidateRoute;
