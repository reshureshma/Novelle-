const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session")
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const env = require("dotenv").config();
const db = require("./config/db");
db();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000//72hour
    }
}))

app.use((req,res,next)=>{
    res.set('cache-control','no-store')
    next()
});


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,"public")));

app.use("/",userRouter);
app.use("/admin",adminRouter);


const PORT = process.env.PORT || 5000; 
app.listen(PORT,()=>{
    console.log(`port secured http://localhost:${PORT}/`);
})

module.exports = app;