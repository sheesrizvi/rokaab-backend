
const express = require("express");

const { generatePdf, getPdf, deletePdf, getPdfByDriverId, getPdfById } = require("../controller/pdfController");


const router = express.Router();
router.route("/create").post(generatePdf);
router.route("/get").get(getPdf);
router.route("/get-by-id").get(getPdfById);
router.route("/get-by-driver").get(getPdfByDriverId);
router.route("/delete").delete(deletePdf);


module.exports = router;