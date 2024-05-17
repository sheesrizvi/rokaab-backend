
const express = require("express");

const { generatePdf, getPdf, deletePdf } = require("../controller/pdfController");


const router = express.Router();
router.route("/create").post(generatePdf);
router.route("/get").get(getPdf);
router.route("/delete").delete(deletePdf);


module.exports = router;