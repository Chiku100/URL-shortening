import mongoose from "mongoose";

const msgSchema=mongoose.Schema({
    long_url:String,
    short_url:String
})
export default mongoose.model("messages",msgSchema)