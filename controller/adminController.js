const User = require("../model/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const pageerror = async(req,res)=>{
    res.render("adminError")
}

const loadLogin = (req,res)=>{
   
    
    if(req.session.admin){
        return res.redirect("/admin/insights");
    }
    res.render("admin/adminlogin",{message:null});
}

const login = async(req,res)=>{
    
    try {

        const {email,password} = req.body;
        console.log("body",req.body);

        const admin = await User.findOne({email,isAdmin:true});
        

        if(admin){

            const passwordMatch = await bcrypt.compare(password,admin.password);
            if(password){
                req.session.admin = true;
                return res.redirect("/admin/insights");
            }else{
                return res.redirect("/admin/login");
            }
        }else{
            return res.redirect("admin/login");
        }
        

    } catch (error) {
        console.log("ERROR IN LOGIN",error);
        return res.redirect("/pagenotfound")
    }
}

const loadInsights = async(req,res)=>{
   if(req.session.admin){
    try {
        res.render("admin/admininsights");

    } catch (error) {
        res.redirect("/pagenotfound");
    }
   }
}
module.exports = {
    loadLogin,
    login,
    loadInsights,
    pageerror
}