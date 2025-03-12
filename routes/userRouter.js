const express = require("express");
const Router = express.Router();
const userController = require("../controller/userController");


Router.get("/",userController.loadHomePage);

Router.get("/login",userController.loadLogin);

Router.get("/signup",userController.loadSignup);
Router.post("/signup",userController.signup)
Router.post("/signup",userController.signup);

Router.post("/verifyotp",userController.verifyOtp);

Router.post("/resendotp",userController.resendOtp);

module.exports = Router;