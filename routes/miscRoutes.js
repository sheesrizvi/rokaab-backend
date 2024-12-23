const express = require("express");
const {
  createCity,
  getCities,
  deleteCities,
  getReport,
  getReportSubscription,
  getReportDriver,
  getReportCompany,
} = require("../controller/miscController");

const router = express.Router();
router.route("/create").post(createCity);
router.route("/get").get(getCities);
router.route("/end").delete(deleteCities);
router.route("/reports").get(getReport);
router.route("/subs").get(getReportSubscription);
router.route("/driver").get(getReportDriver);
router.route("/company").get(getReportCompany);
module.exports = router;
