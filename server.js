const express = require('express')
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const passport=require('passport')
//Firing express
const app = express();


//Use the body-parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//requiring the routes
const user= require("./routers/api/user")
const profile= require("./routers/api/profile")
const post= require("./routers/api/post")


// importing databse user url to connect
const db= require('./config/key').mongoURL

// connecting to mongoDb
mongoose.connect(db,{ useNewUrlParser: true }).then(()=>{
    console.log("MongoDb connected successfully")
}).catch(err=>
    console.log((err))
)

app.get('/', (req,res)=>{
  res.send("Hello World")
});

//Using Passport Middleware
app.use(passport.initialize())

//Passport config
require('./config/passport')(passport)
//Using Routes
app.use('/user',user)
app.use('/profile',profile)
app.use('/post',post)

//setting up the host and the port
const port= process.env.PORT || "5000"
app.listen(port, ()=>{console.log(`Server running in ${port}`);});
