import { RolesModel } from "../models/rolesModel.js";
import asyncHandler from "express-async-handler";

export const NewRole = asyncHandler(async (req, res) => {
  if (!req.body.role) return res.status(403).json({msg:"error missing field role"});
  try {
    if (!(await RolesModel.findById("roles"))) {
      await RolesModel.update(
        { _id: "roles", items: [req.body.role] },
        { $set: { items: [req.body.role] } },
        { upsert: true }
      );
      return res.status(200).json({msg:"new role was created successfully"});
    } else {
      const find = await RolesModel.findById("roles");
      if (!find.items.includes(req.body.role)) {
        find.items.push(req.body.role);
        await RolesModel.updateOne({ _id: "roles" }, { items: find.items });
        return res.status(200).json({msg:"new role was created successfully"});
      } else {
        res.status(200).json({msg:"role already existing"});
      }
    }
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});

export const GetRoles = asyncHandler(async (req, res) => {
  try {
      const roles = await RolesModel.find().select('_id items role');
      return res.status(200).json(roles[0].items);
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
    console.error(error.message);
  }
});
