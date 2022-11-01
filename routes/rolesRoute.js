import express from "express";
import { NewRole } from "../controllers/rolesController.js"
const rolesRoute = express.Router();

rolesRoute.route("/new").post(NewRole);

export default rolesRoute;
