import mongoose from "mongoose";
import Conversation from "./conversation";

const messageSchema= new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true


    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
        

    },
        message :{
            type:String,
            default:"",
            required:true

        }

        
    ,seen:{
        type:Boolean,
        default:false
    }},
    {timestamps:true})
const Message=mongoose.model("Message",messageSchema)
export default Message