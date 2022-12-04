const express=require("express");
const mongoose=require("mongoose");
const app=express();
const ejs=require("ejs");
app.set("view engine","ejs");
mongoose.connect("mongodb+srv://testUser:12345@cluster0.ivvqkp6.mongodb.net/date_otp", {useNewUrlParser:true},{useUnifiedTopology:true});
const Schema={
    date:String,
    subject:String,
    otp:String
}
const Note=mongoose.model("Note",Schema);

app.get("/",(req,res)=>{

    Note.find({},function(err, notes){
        res.render("markattstud",{
            details:notes
        })
    })
})
app.listen(4000, function(){
    console.log("server is running");
})