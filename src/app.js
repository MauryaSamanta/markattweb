const express=require("express");
const app=express();
var session=require("express-session");
var flush=require("connect-flash");
//require("./db/conn");

//const Note=require("./models/otp_send");
//const Rec=require("./models/record");
const path=require("path");
const port=process.env.PORT || 3000;
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const { MongoClient } = require("mongodb");
app.use(bodyParser.urlencoded({extended:true}));
const teach_login=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance");
const loginSchema=new mongoose.Schema({
    name:String,
    password:String
    

    
},
{collection:"users"});

const Log=teach_login.model("users", loginSchema);
const stud_login=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance");
const loginStudSchema=new mongoose.Schema({
    NameStud:String,
    RollNo:String
    

    
},
{collection:"TStudents"});

const LogStud=teach_login.model("TStudents", loginStudSchema);
const otp=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/date_otp");
const notesSchema=new mongoose.Schema({
    date:String,
    subject:String,
    otp:String,
    TEACHER:String
    
});

const Note=otp.model("Note", notesSchema);
module.exports=Note;
const record=mongoose.createConnection("mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance");
const TStudSchema=new mongoose.Schema({
    RollNo:String,
    Attper:String,
    Noclass:String,
    Present:String,
    REGISTRY:String
    },
    {collection:"TStudents"});
const Rec=record.model("TStudents", TStudSchema);
const PStudSchema=new mongoose.Schema({
    RollNo:String,
    Attper:String,
    Noclass:String,
    Present:String,
    REGISTRY:String
    },
    {collection:"PStudents"});
const PRec=record.model("PStudents", PStudSchema);
const TRecSchema=new mongoose.Schema({
    rollStud:String,
    DATEclass:String,
    STATUS:String,
    Teacher:String
},
{collection:"TStudents_Class"});
const TRec=record.model("TStudents_Class",TRecSchema);
const PRecSchema=new mongoose.Schema({
    rollStud:String,
    DATEclass:String,
    STATUS:String,
    Teacher:String
},
{collection:"PStudents_Class"});
const PrRec=record.model("PStudents_Class",PRecSchema);
//create a data schema
    var p=0;
    var nc=0;
    var att=0.0;
    var roll="";
    date="";
    var np=0;
    var sub="";
    var teach="";
    var reg_status="";
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"../public")));
app.set("view engine", "hbs");
app.use(session({
    secret: "secret",
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
}));
app.use(flush());
app.get("/", (req,res)=>{
    res.render("login_page");
});
app.get("/markattstud",(req,res)=>{
    res.render("markattstud");
});
app.get("/afterrecord",(req,res)=>{
    res.render("afterrecord");
});
app.get("/delete", (req,res)=>{
    res.render("delete");
})
app.post("/login_page", async(req,res)=>{
    try {
        const User_Check=await Log.findOne({name:req.body.uname});
        if(User_Check.password === req.body.pw)
        {
            var data={
                name:req.body.uname
                
            }
            res.render("index", {data:data});
        }
        else{
            
        }
    } catch (error) {
        
    }
})
app.post("/student_login_page",async(req,res)=>{
      try {
        const Stud_Check=await LogStud.findOne({NameStud:req.body.uname});
        //console.log(Stud_Check.RollNo);
        if(Stud_Check.RollNo === req.body.pw)
        {    
            var demo={roll:req.body.pw}
            res.render("markattstud",{demo:demo});
        }
        else{
           
        }
      } catch (error) {
        
      }
})
app.post("/markattstud", async(req,res)=>{
    sub=req.body.subject;
    
    try { if(req.body.subject=="theory"){
        console.log(req.body.subject);
        var yyd=req.body.ENTERDATE;
        const parts=yyd.split("-");
        var y=parts[0];
        var m=parts[1];
        var d=parts[2];
        if(m<10)
        m="0"+m;
        
        var date=d+"-"+m+"-"+y;

        const otp=req.body.otp;
        console.log(date);
        const date_check=await  Note.findOne({date:date});
        if(date_check.otp === otp)
        { console.log("Correct OTP");
            roll=req.body.roll;
            
          const roll_check=await Rec.findOne({RollNo:roll});
           p=roll_check.Present;
           nc=roll_check.Noclass;
           att=roll_check.Attper;
            teach=date_check.TEACHER;
           reg_status=roll_check.REGISTRY;
          //console.log(p);
          //nc++;
          //var present=parseInt(p);
          p++;
          nc++;
          att=Math.round((p/nc)*100);
          let newRec=new TRec({
            rollStud:roll,
            DATEclass:date,
            STATUS:"1",
            Teacher:teach
           
           });
           
           const rec_date=await newRec.save();
          var demo={
            Date:date,
            Present:p,
            Noclass:nc,
            Attper:att
          }
          await Rec.findOneAndUpdate({RollNo:roll},{
            Present:p,
            Noclass:nc,
            Attper:att,
            REGISTRY: "REGISTERED"
          })
          res.render("afterrecord",{demo:demo});
           //att=(p/nc)*100;
           //console.log(p);
        }
         else{
            console.log("Wrong OTP");
         }

        }//end of if for theory
        else if(req.body.subject=="practical"){
            
            var yyd=req.body.ENTERDATE;
        const parts=yyd.split("-");
        var y=parts[0];
        var m=parts[1];
        var d=parts[2];
        if(m<10)
        m="0"+m;
        
        var date=d+"-"+m+"-"+y;
            np++;
            const otp=req.body.otp;
            const date_check=await  Note.findOne({date:date});
            if(date_check.otp === otp)
            { console.log("Correct OTP");
                roll=req.body.roll;
              const roll_check=await PRec.findOne({RollNo:roll});
               p=roll_check.Present;
               nc=roll_check.Noclass;
               att=roll_check.Attper;
               reg_status=roll_check.REGISTRY;
               if(reg_status==="NOT REGISTERED")
              //console.log(p);
              //nc++;
              //var present=parseInt(p);
              {p++;
              nc++;
              att=Math.round((p/nc)*100);
              let newRec=new PrRec({
                rollStud:roll,
                DATEclass:date,
                STATUS:"1",
                Teacher:teach
               
               });
               
               const rec_date=await newRec.save();
              var demo={
                Date:date,
                Present:p,
                Noclass:nc,
                Attper:att
              }
              await PRec.findOneAndUpdate({RollNo:roll},{
                Present:p,
                Noclass:nc,
                Attper:att,
                REGISTRY:"REGISTERED"
              })
              res.render("afterrecord",{demo:demo});
               //att=(p/nc)*100;
               //console.log(p);
              }else{
                res.send("YOU ARE NOT FROM THIS BATCH")
              }}
             else{
                console.log("Wrong OTP");
             }
        }
    }
     catch (error) {
        res.status(400).send("Invalid OTP");
    }


})
app.put("/markattstud",async(req,res)=>{
    let doc=await Rec.findOneAndUpdate({RollNo:roll},{
        Present:p.toString(),
        Noclass:nc.toString(),
        Attper:att.toString()
      })
      alert("YOUR ATTENDANCE HAS BEEN RECORDED SUCCESSFULLY");
})
app.post("/delete",async (req,res)=>{
        
        
        var nAb=0;
        if(sub==="theory")
        {const uri="mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance";
        const client=new MongoClient(uri);
         try{
            const database=client.db("Attendance");
            const col=database.collection("TStudents");
            const cursor=col.find();
            cursor.forEach(function(Doc){
                
                
                if(Doc.REGISTRY==="NOT REGISTERED")
            {   //console.log(Doc.Present);
                var roll=Doc.RollNo;
                console.log(roll);
               // console.log(na);
                
                
                var p=Doc.Present;
                var nc=Doc.Noclass;
                nc++;
                var a=(p/nc)*100;
                console.log(a);
                Rec.findOneAndUpdate({RollNo:roll},{
                    Present:p,
                    Noclass:nc,
                    Attper:a
                }).exec();
                var yyd=req.body.date2;
                const parts=yyd.split("-");
                var y=parts[0];
                var m=parts[1];
                var d=parts[2];
                if(m<10)
                m="0"+m;
                
                var date=d+"-"+m+"-"+y;
                  let abRec=new TRec({
                    rollStud:Doc.RollNo,
                    DATEclass:date,
                    STATUS:"0",
                    Teacher:teach
                  })
                  const rec_date= abRec.save(); 
                }
                else if(Doc.REGISTRY==="REGISTERED")
                {   
                   Rec.findOneAndUpdate({RollNo:Doc.RollNo},{
                    REGISTRY:"NOT REGISTERED"
                   }).exec();
                }
            }); 
            var yyd=req.body.date2;
                const parts=yyd.split("-");
                var y=parts[0];
                var m=parts[1];
                var d=parts[2];
                if(m<10)
                m="0"+m;
                
                var date=d+"-"+m+"-"+y;
            Note.deleteOne({date:date},function(err,docs){
            
            });
               
        }
        catch{

        }    
    }
    else{
        const uri="mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance";
        const client=new MongoClient(uri);
         try{
            const database=client.db("Attendance");
            const col=database.collection("PStudents");
            const cursor=col.find();
            cursor.forEach(function(Doc){
                
                
                if(Doc.REGISTRY==="NOT REGISTERED")
            {   //console.log(Doc.Present);
                var roll=Doc.RollNo;
                console.log(roll);
               // console.log(na);
                
                
                var p=Doc.Present;
                var nc=Doc.Noclass;
                nc++;
                var a=(p/nc)*100;
                console.log(a);
                PRec.findOneAndUpdate({RollNo:roll},{
                    Present:p,
                    Noclass:nc,
                    Attper:a,
                    REGISTRY:"BATCH"
                }).exec();
                var yyd=req.body.date2;
                const parts=yyd.split("-");
                var y=parts[0];
                var m=parts[1];
                var d=parts[2];
                if(m<10)
                m="0"+m;
                
                var date=d+"-"+m+"-"+y;
                  let abRec=new PrRec({
                    rollStud:Doc.RollNo,
                    DATEclass:date,
                    STATUS:"0",
                    Teacher:teach
                  })
                  const rec_date= abRec.save(); 
                }
                else if(Doc.REGISTRY==="REGISTERED")
                {   
                   PRec.findOneAndUpdate({RollNo:Doc.RollNo},{
                    REGISTRY:"BATCH"
                   }).exec();
                }
            }); 
            var yyd=req.body.date2;
                const parts=yyd.split("-");
                var y=parts[0];
                var m=parts[1];
                var d=parts[2];
                if(m<10)
                m="0"+m;
                
                var date=d+"-"+m+"-"+y;
            Note.deleteOne({date:date},function(err,docs){
            
            });
               
        }
        catch{

        }    
    }
        //console.log(nAb);
        var demo={
          
            date:date
        }
        res.render("date_data",{demo:demo});
});

app.get("/markattstud",(req,res)=>{
    res.render("markattstud");
})
app.post("/index",async(req,res)=>{
    try{var yyd=req.body.ENTERDATE;
        const parts=yyd.split("-");
        var y=parts[0];
        var m=parts[1];
        var d=parts[2];
        if(m<10)
        m="0"+m;
        
        var rD=d+"-"+m+"-"+y;
        let newNote=new Note({
     date:rD,
     subject:req.body.subject,
     otp:req.body.otp,
     TEACHER:   req.body.teacher
    });
    
    const otp=await newNote.save();
    if(req.body.subject!="theory"){
    const uri="mongodb+srv://testUser:12345@cluster0.3oc0kuh.mongodb.net/Attendance";
        const client=new MongoClient(uri);
        try {
            const database=client.db("Attendance");
            const col=database.collection("PStudents");
            const cursor=col.find();
            cursor.forEach(function(Doc){
                if(Doc.BATCH===req.body.subject){
                    PRec.findOneAndUpdate({RollNo:Doc.RollNo},{
                        REGISTRY: "NOT REGISTERED"
                    }).exec();
                }
            })
        } catch (error) {
            
        }}
     res.status(201);
     }
    catch(error){
        res.status(400).send(error);
    }
    //res.redirect("/");
 })
app.listen(port, (req,res)=>{
    console.log("server is running");
})