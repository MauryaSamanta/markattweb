const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://testUser:12345@cluster0.ivvqkp6.mongodb.net/Attendance", {useNewUrlParser:true},{useUnifiedTopology:true},{useFindAndModify:false});
//create a data schema