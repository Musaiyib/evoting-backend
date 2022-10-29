const express = require("express");
const {
  getPayments,
  setPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(requireAuth, getPayments).post(requireAuth, setPayment);

router
  .route("/:id")
  .put(requireAuth, updatePayment)
  .delete(requireAuth, deletePayment);

module.exports = router;
