const User = require("../model/userSchema")

const loadHomePage = async(req,res)=>{
    try {

        return res.render("user/home");

    } catch (error) {

        console.log("Home page not found");
        res.status(500).send("server error");
        
    }
}

const loadLogin = async(req,res)=>{
    try {

        return res.render("user/login");

    } catch (error) {

        console.log("Home page not found");
        res.status(500).send("server error");

    }
}

const loadSignup = async(req,res)=>{
    try {

        return res.render("user/signup");

    } catch (error) {

        console.log("Home page not found");
        res.status(500).send("server error");

    }
}

const signup = async(req,res)=>{
    const {name,email,phone,password} = req.body
    try {

       const user = new User({name,email,phone,password});
    //    console.log("userdata",user);
       

       await user.save();

       return res.redirect("/login");

    } catch (error) {
        
        console.error("Error while saving user",error); 
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    loadHomePage,
    loadLogin,
    loadSignup,
    signup
}