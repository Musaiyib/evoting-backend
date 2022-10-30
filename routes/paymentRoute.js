import express from "express";
import {
  getPayments,
  setPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";
import { requireAuth } from"../middleware/authMiddleware.js";
const paymentRoute = express.Router();

paymentRoute.route("/").get(requireAuth, getPayments).post(requireAuth, setPayment);

paymentRoute
  .route("/:id")
  .put(requireAuth, updatePayment)
  .delete(requireAuth, deletePayment);

export default paymentRoute;
