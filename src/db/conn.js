const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const otp=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.ivvqkp6.mongodb.net/date_otp");
const notesSchema=new mongoose.Schema({
    date:String,
    subject:String,
    otp:String,

    
});

const Note=otp.model("Note", notesSchema);
module.exports=Note;
const record=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.ivvqkp6.mongodb.net/Attendance");
const TStudSchema=new mongoose.Schema({
    RollNo:String,
    Attper:String,
    Noclass:String,
    Present:String
    });
const Rec=record.model("TStudents", TStudSchema);
//create a data schema

