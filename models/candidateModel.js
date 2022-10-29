const mongoose = require("mongoose");

const candidateModel = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "user",
    // },
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Candidates", candidateModel);
