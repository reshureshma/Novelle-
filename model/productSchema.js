const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    description
})