const mongoose = require("mongoose");

const tripHistorySchema = mongoose.Schema(
  {
    locto: {
      type: String,
      required: true
    },
    locfrom: {
      type: String,
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    plateno: {
      type: String,
    },
    passengers: [{
      name: { type: String },
      nationality: { type: String },
      mobile: { type: String },
      passportNo: { type: String }
    }]
  },
  {
    timestamps: true,
  }
);

const TripHistory = mongoose.model("TripHistory", tripHistorySchema);

module.exports = TripHistory;
