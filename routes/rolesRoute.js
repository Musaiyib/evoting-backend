import express from "express";
import { GetRoles, NewRole } from "../controllers/rolesController.js"
const rolesRoute = express.Router();

rolesRoute.route("/new").post(NewRole);
rolesRoute.route("/").get(GetRoles);

export default rolesRoute;
