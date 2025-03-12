const express = require("express");
const Router = express.Router();
const adminController = require("../controller/adminController");
const {userAuth,adminAuth} = require("../middlewares/auth")


Router.get("/pageerror",adminController.pageerror)

Router.get("/login",adminController.loadLogin);
Router.post("/login",adminController.login);

Router.get("/insights",adminAuth,adminController.loadInsights);

Router.get("/logout",adminController.logout);

//user management.

Router.get("/user",adminAuth,adminController.userInfo)

Router.get("/product",adminController.productInfo);
module.exports = Router;