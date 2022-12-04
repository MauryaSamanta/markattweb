const mongoose=require("mongoose");


const notesSchema=new mongoose.Schema({
    date:String,
    subject:String,
    otp:String,

    
});

const Note=mongoose.model("Note", notesSchema);
module.exports=Note;