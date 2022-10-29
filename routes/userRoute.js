const express = require("express");
const {
  handleNewCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
} = require("../controllers/candidateController");
const router = express.Router();
const {
  handleNewUser,
  getUsers,
  updateUser,
  deleteUser,
  login,
  getMe,
} = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");

// get/login elcom
router.route("/").get(requireAuth, getMe).post(login);

router.route("/allusers").get(requireAuth, getUsers);

// registering elcom
router.route("/register").post(handleNewUser);

// modifying/deleting elcom
router
  .route("/:id")
  .put(requireAuth, updateUser)
  .delete(requireAuth, deleteUser);

// registering candidate
router.route("/register/candidate").post(handleNewCandidate);
router.route("/candidates").get(getCandidates);

// modifying/deleting candidate
router
  .route("/candidate/:id")
  .put(requireAuth, updateCandidate)
  .delete(requireAuth, deleteCandidate);
module.exports = router;
