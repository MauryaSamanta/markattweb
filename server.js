const express=require("express");
const app=express();
const port=process.env.PORT || 3000;
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://testUser:12345@cluster0.ivvqkp6.mongodb.net/date_otp", {useNewUrlParser:true},{useUnifiedTopology:true});
//create a data schema
const notesSchema=new mongoose.Schema({
    date:String,
    subject:String,
    otp:String,

    expire_at:{
        type:Date,
        default:Date.now(),
        expires:240
    }
},{timestamp:true})
notesSchema.index({"expire_at":1},{expireAfterSeconds:240});
const path=require("path");
const Note=mongoose.model("Note", notesSchema);
app.use(express.static(path.join(__dirname,"public")));
app.get("/", function(req,res){

    res.sendFile(path.join(__dirname,"public","markatt.html"));
})
//app.post
app.post("/",function(req,res){
   let newNote=new Note({
    date:req.body.ENTERDATE,
    subject:req.body.subject,
    otp:req.body.otp
   });
   newNote.save();
   //res.redirect("/");
})
app.listen(port, function(){
    console.log("server is running");
})

/*app.get("/read", (req,res)=>{
     newNote.find((err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            return res.status(200).send(data)
        }
     })

})*/