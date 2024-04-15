const mongoose =require("mongoose")
const {Schema}=require("mongoose")

const userSchema =new Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    image:{
        type:Buffer,
        required:true
    },
    video:{
        type:Buffer,
        required:true
    },
    pdf:{
        type:Buffer,
        required:true
    },
    text:{
        type:Buffer,
        required:true
    },
})

const UserSchema=mongoose.model("UserSchema",userSchema)

module.exports=UserSchema