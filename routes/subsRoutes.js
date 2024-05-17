
const express = require("express");

const { createSubscription, subscriptionStatus, renewSubscription, endSubscription, allSubscription, deleteSubscription, subsChange } = require("../controller/subscriptionController");
const router = express.Router();
router.route("/create").post(createSubscription);
router.route("/get").get(subscriptionStatus);
router.route("/getall").get(allSubscription);
router.route("/change").post(subsChange);
router.route("/renew").post(renewSubscription);
router.route("/end").post(endSubscription);
router.route("/delete").delete(deleteSubscription);

module.exports = router;