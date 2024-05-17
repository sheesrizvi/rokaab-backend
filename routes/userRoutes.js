const express = require("express");
const {
  photo,
  registerUser,
  getUsers,
  authUser,
  getBlockedUser,
  getUserById,
  searchDriver,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const router = express.Router();
router.route("/").post(registerUser).get(getUsers);
router.post("/login", authUser);
router.get("/search", searchDriver);
router.post("/update", updateUser);
router.get("/blocked", getBlockedUser);
router.delete("/delete", deleteUser);
router.route("/scan").get(photo);
router.route("/getById").get(getUserById);
module.exports = router;
