const mongoose=require("mongoose");

//create a data schema
const TStudSchema=new mongoose.Schema({
    RollNo:String,
    Attper:String,
    Noclass:String,
    Present:String
    });
const Rec=mongoose.model("TStudents", TStudSchema);
module.exports=Rec;