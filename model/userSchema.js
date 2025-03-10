const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim : true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone:{
        type:String,
        required: false,
        sparse:true,//allows user to register without phn num
        default:null,
        unique: true,
        trim: true,
        match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"]
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true // Allows null values while enforcing uniqueness for non-null values
    },
    password:{
        type:String,
        required:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart:[{
        type:Schema.Types.ObjectId,
        ref:"Cart"
    }],
    wallet:{
        type:Number,
        default:0
    },
    wishlist:[{
        type:Schema.Types.ObjectId,
        ref:"Wishlist"
    }],
    orderHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Order"
    }],
    createdOn:{
        type:Date,
        default:Date.now
    },
    referalCode:{
        type:String
    },
    redeemed:{
        type:Boolean
    },
    redeemedUsers:[{
        type: Schema.Types.ObjectId,
        ref:"Category"
    }],
    searchHistory:[{
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        searchOn:{
            type:Date,
            default:Date.now
        }
    }]

})

const User = mongoose.model("User",userSchema);

module.exports = User;