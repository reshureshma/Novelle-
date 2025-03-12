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

const logout = async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err){
                console.log("Erropr destroying session");
                return res.redirect("/pageerror"); 
            }
            res.redirect("/admin/login");
        })
    } catch (error) {
        console.log("unexpected error during logout",error);
        res.redirect("/pageerror");
        
    }
}


//user management.

const userInfo = async(req,res)=>{
    try {

       let search = "";
       if(req.query.search){
        search = req.query.search;
       } 

       let page = 1;
       if(req.query.page){
        page = req.query.page
       }
       const limit = 3;
       const userData = await User.find({
        isAdmin:false,
        $or:[
            {name: {$regex:".*"+search+".*"}},
            {email:{$regex:".*"+search+".*"}}
        ],
       })
       .limit(limit*1)
       .skip((page-1)*limit)
       .exec();

       const count = await User.find({

        isAdmin:false,
        $or:[
            {name: {$regex:".*"+search+".*"}},
            {email:{$regex:".*"+search+".*"}}
        ],

       }).countDocuments();

       res.render("admin/adminuser")

    } catch (error) {
        
    }
}

const productInfo = async(req,res)=>{
    try {
        res.render("admin/adminproduct");
    } catch (error) {
        console.log("ERROR IN PRODUCT",error);
        return res.redirect("/pagenotfound")
    }
}

module.exports = {
    loadLogin,
    login,
    loadInsights,
    pageerror,
    logout,
    userInfo,
    productInfo
}