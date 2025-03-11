const User = require("../model/userSchema");
const nodemailer = require("nodemailer");
const env = require("dotenv").config();
const bcrypt = require("bcrypt");

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

function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString();

}

async function sendVerificationEmail(email,otp){
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            PORT:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Verify your account.",
            text:`Your OTP is ${otp}`,
            html:`<b>Your OTP : ${otp} </b>`
        })

        console.log(info);
        return info.accepted.length >0;
    } catch (error) {
       console.error("Error sending email",error);
       return false; 
    }
}


const signup = async(req,res)=>{
    // const {name,email,phone,password} = req.body
    // try {

    //    const user = new User({name,email,phone,password});
    // //    console.log("userdata",user);
       

    //    await user.save();

    //    return res.redirect("/login");
    try{
        const {name,phone,email,password,cpassword} = req.body;

        if (password!==cpassword){
         return res.render("signup",{message:"password doesnt match"});
        }

        const findUser = await User.findOne({email});
        if (findUser){
            return res.render("signup",{message:"User with this email already exist"});
        }

        const otp = generateOtp();

        const emailSent = await sendVerificationEmail(email,otp);
        console.log("emailsend",emailSent);
        
        if(!emailSent){
            return res.json("email-error");
        }

        req.session.userOtp = otp;
        req.session.userData = {name,phone,email,password};

        res.render("user/verifyotp");
        console.log("OTP sent",otp);

    } catch (error) {
        
        console.error("signup error",error); 
        res.redirect("/pagenotfound");
    }
}

const securePassword = async(password)=>{
    try {
        
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.error("error while hashing");
        
    }
}

const verifyOtp = async(req,res)=>{
    try {
        console.log("Raw Request Body:", req.body);
        const {otp} = req.body;

        console.log("otp",req.body);
        console.log(req.session);
        

        if(req.session.userOtp == otp){
            console.log("hello");
            
            const user = req.session.userData;
            //password hash
            const passwordHash = await securePassword(user.password);
            console.log("hashed",passwordHash);
            

            const saveUserData = new User({
                name:user.name,
                email:user.email,
                phone:user.phone,
                password:passwordHash
            })

            console.log("userdata",saveUserData); 
            

            await saveUserData.save();
            req.session.user = saveUserData._id;
            res.render("user/login")
        }else{
            res.status(400).json({success:false,message:"Invalid OTP,Please try again."})
        }
        
    } catch (error) {
        console.error("Error verifying otp");
        res.status(500).json({success:false,message:"An error occured"})
        
    }
}

const resendOtp = async(req,res)=>{
    try {
        

        const {email} = req.session.userData;
        if(!email){
            return res.status(400).json({success:false,message:"email not found in session"});
        }
        const otp = generateOtp();
        req.session.userOtp = otp;

        const emailSent = await sendVerificationEmail(email,otp);
        if(emailSent){
            console.log("Resend otp:",otp);
            res.status(200).json({success:true,message:"Otp sent successfully"});
            
        }
        else{
            res.status(500).json({success:false,message:"failed to resent otp, please try again"})
        }
    } catch (error) {
        console.log("Resent otp error");
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

module.exports = {
    loadHomePage,
    loadLogin,
    loadSignup,
    signup,
    verifyOtp,
    resendOtp
}