import mongoose, { Schema } from "mongoose"

const RolesSchema = new Schema({
    _id: String,
    items: []
})

export const RolesModel = mongoose.model('Role', RolesSchema)