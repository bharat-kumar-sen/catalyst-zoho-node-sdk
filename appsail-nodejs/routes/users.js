const express = require("express");
const router = express.Router();
const Users = require("../controllers/usersController");

router.post("/saveUserInfo", Users.saveUserInfo);
router.post("/doSignIn", Users.doSignIn);
router.get("/getUsersList", Users.getUsersList);
router.post("/list", Users.getUsersList);
router.get("/logout", Users.logout);
router.delete("/delete/:id", Users.deleteUser);
module.exports = router;
