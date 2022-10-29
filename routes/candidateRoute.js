const express = require("express");
const {
  handleNewCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
  vote,
} = require("../controllers/candidateController");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");

// Voter candidate routes
router.route("/vote").post(vote);

//Elcom candidate routes
// registering candidate
router.route("/register").post(handleNewCandidate);
router.route("/all").get(getCandidates);
// modifying/deleting candidate
router.route("/:id").put(updateCandidate).delete(deleteCandidate);
module.exports = router;
