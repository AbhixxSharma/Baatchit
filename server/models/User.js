import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import env from "dotenv"
// 

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true,
        
        trim:true,
    }
    ,
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
         type: String,
         required: true,
         minlength: 8,

    },
}, {
    timestamps: true,
  }
)
UserSchema.methods.generateAccessToken=function(){

  return jwt.sign({
    // phela hai payload
    id:this._id
   },
    // dusra secret{}
    process.env.ACCESS_TOKEN_SECRET
    ,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY

    }
      
)}
UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        id:this._id
    },
process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}





const User = mongoose.model("User",UserSchema)
export default User