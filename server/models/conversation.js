import mongoose from "mongoose";

const converstionSchema=new mongoose.Schema({

    participants:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"

 } ],
    lastMessage:{
        type:String,
        default:""

    }


    },{timestamps: true}

    

)
const Conversation =mongoose.model("Converstion",converstionSchema)
export default Conversation;