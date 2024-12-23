
const express = require("express");

const { 
  generatePdf, getPdf, deletePdf, getPdfByDriverId, getPdfById,
  getAllTripsHistory,
  getTripsByDriverId,
  getTripsById
 } = require("../controller/pdfController");


const router = express.Router();
router.route("/create").post(generatePdf);
router.route("/get").get(getPdf);
router.route("/get-by-id").get(getPdfById);
router.route("/get-by-driver").get(getPdfByDriverId);
router.route("/delete").delete(deletePdf);
router.route('/get-all-trips-history').get(getAllTripsHistory)
router.route('/get-trips-by-driverId').get(getTripsByDriverId)
router.route('/get-trips-by-id').get(getTripsById)

module.exports = router;