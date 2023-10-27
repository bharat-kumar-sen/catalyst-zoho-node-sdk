const express = require("express");
const router = express.Router();
const Users = require("../controllers/usersController");
const GlobalS = require('../core/globalService')
router.post("/saveUserInfo", GlobalS.verifyToken, Users.saveUserInfo);
router.post("/doSignIn", Users.doSignIn);
router.get("/getUsersList", GlobalS.verifyToken, Users.getUsersList);
router.post("/list", GlobalS.verifyToken, Users.getUsersList);
router.get("/logout", Users.logout);
router.delete("/delete/:id", GlobalS.verifyToken, Users.deleteUser);
module.exports = router;
