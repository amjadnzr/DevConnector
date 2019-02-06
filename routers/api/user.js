const express = require('express')
const router= express.Router();
const User= require('../../models/User')
const gravatr= require('gravatar')
const bcrypt= require('bcryptjs')
const key = require('../../config/key')
const jwt= require('jsonwebtoken');
const passport = require('passport')

//Loading Validators
const validateRegisterInput= require('../../validation/register')
const validateLoginInput= require('../../validation/login')



//@routes GET api/user/test
//@desc testing user routes
//@access public
router.get('/test',(req,res)=>{
   res.json({msg:"user is loaded"})
}) 

//@routes POST api/user/register
//@desc to register a new user
//@access public
router.post('/register',(req,res)=>{

 const {errors,isValid} = validateRegisterInput(req.body)
  
 //checking for validty
 if(!isValid){
    return res.status(400).json({errors})
 }
   const avatar= gravatr.url(req.body.email,{
        s:'200', //Size
        r:'pg', // Rating
        d: 'mm'  //Default
    })

  User.findOne({email:req.body.email})
  .then(
      user=>{
          if(user){
              errors.email='Email Already Exist'
             return res.status(400).json({errors})}
            else{
                const newUser= new User({
                   name:req.body.name,
                   email:req.body.email,
                   password:req.body.password,
                   avatar
                })
              //hashing the password to save in the database
              bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                       // if (err) throw err;
                      newUser.password= hash
                      newUser.save()
                      .then(user=>{res.json(user)})
                      .catch(err=>{console.log(err)
                      })
                    })
              })  
            

            }  
      })
})

//@routes POST api/user/login
//@desc to login/passing JWT
//@access public
router.post('/login', (req,res)=>{

    const {errors,isValid} = validateLoginInput(req.body)
  
 //checking for validty
 if(!isValid){
    return res.status(400).json({errors})
 }

 // Storing the values gained form the form to constants
  const email=req.body.email
  const password=req.body.password

  //searching for email related object in database database
  User.findOne({email})
  .then(user=>{
      //confirming whether the user exist
     if(!user){
         errors.email="Account Doesn't exist"
        return res.status(400).json(errors)
     }

     //Checking whether  password is correct
     bcrypt.compare(password,user.password, (err,isMatch)=>{
         if(isMatch){
            //User Matched
          //Creating jwt payload
          const payload={
              name:user.name,
              id:user.id,
              avatar:user.avatar
          }

           //Signing jwt
           jwt.sign(
             payload,
             key.secretOrKey,
             {expiresIn:3600},
             (err,token)=>{
               res.json({
                   success:true,
                   token: "Bearer "+ token 
               })
             }
  
           )

         }
         else{
             errors.password='Invalid password'
             res.status(400).json(errors)
         }
     })
  })
})

//@routes POST api/user/current
//@desc Return the current user
//@access private
router.get('/current',passport.authenticate('jwt',{session:false}), (req,res)=>{
    console.log('done')
    res.json(req.user)
})


module.exports = router