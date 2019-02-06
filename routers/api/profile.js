const express = require('express')
const router= express.Router();
const passport=require('passport')
const mongoose= require('mongoose')

//loading Profile model
const Profile= require('../../models/Profile')

//loading User model
const User= require('../../models/User')

//loading profile validation
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput=require('../../validation/experience')
const validateEducationInput=require('../../validation/education')
//@routes GET api/profile/test
//@desc testing profile routes
//@access public
router.get('/test',(req,res)=>{
   res.json({msg:"profile is loaded"})
}) 


//@routes GET api/profile/
//@desc get users profile
//@access private

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}
   
   Profile.findOne({user:req.user.id})
   .populate('user',['name','avatar'])
   .then(
       profile=>{
        if(!profile){
            errors.noprofile="Profile doesnt exist"
            return res.status(404).json(errors)
        }
        return res.status(200).json(profile)
       }
   ).catch(err=>res.status(404).json(err))
    


})

//@routes POST api/profile/user/:user_id
//@desc get profle by User_Id
//@access public

router.get('/user/:user_id', (req,res)=>{
    errors={}
    Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile="Proifle not found "
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=>res.status(404).json({profile:'Profile not found'}))
})

//@routes POST api/profile/all
//@desc get all profiles
//@access public
router.get('/all',(req,res)=>{
    const errors={}
    Profile.find().populate('user',['name','avatar'])
    .then(profiles=>{
        if(!profiles){
            errors.noprofile="No profiles exist"
           return res.status(404).json(errors)
        }

        res.json(profiles)
    }).catch(err=>res.status(404).json({profile:'Profile not found'}))

})

//@routes POST api/profile/handle/:handle
//@desc get profle by handle
//@access public

router.get('/handle/:handle', (req,res)=>{
    errors={}
    Profile.findOne({handle:req.params.handle}).populate('user',['name','avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile="Proifle not found "
            return res.status(404).json(errors)
        }
        res.json(profile)
    }).catch(err=>res.status(404).json(err))
})


//@routes POST api/profile/
//@desc create user profile
//@access private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
     
    const {errors,isValid} = validateProfileInput(req.body)

    // Check Validation
    if(!isValid){
        // returning error with 400 status
        return res.status(400).json(errors)
    }

    const profileField = {}
    profileField.user=req.user.id;
    console.log(profileField.user)
    if(req.body.handle) profileField.handle = req.body.handle;
    if(req.body.company) profileField.company = req.body.company;
    if(req.body.website) profileField.website = req.body.website;
    if(req.body.location) profileField.location = req.body.location;
    if(req.body.bio) profileField.bio = req.body.bio;
    if(req.body.status) profileField.status = req.body.status;
    if(req.body.githubusername) profileField.githubusername = req.body.githubusername;
    // spliting skiils seperated by , to an array
    if(typeof req.body.skills !== 'undefined') {
       profileField.skills= req.body.skills.split(',')
    }
    
    //to get the social profile initiating a an object for social property
      profileField.social={}

    if(req.body.youtube) profileField.social.youtube = req.body.youtube;
    if(req.body.facebook) profileField.social.facebook = req.body.facebook;
    if(req.body.twitter) profileField.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileField.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileField.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id}).then(profile=>{
        if(profile){
            //updating the profile
            Profile.findOneAndUpdate({user:req.user.id},{$set:profileField},{new:true})
            .then(profile=>res.status(200).json(profile))
        }
        else{
            //creating a profile

            //check if handle exist
            Profile.findOne({handle:req.body.handle}).then(
                handle=>{
                    if(handle){
                        errors.handle='handle exist for another account'
                        res.status(400).json(errors)
                    }
                }
            )
             
            //save profile
            new Profile(profileField).save().then( profile=> res.json(profile))
        }
    }
        
    )
})

//@routes POST api/profile/experience
//@desc add experience
//@access private
 router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
      const {errors,isValid}=validateExperienceInput(req.body)

      //Check Validation
      if(!isValid){
          //return error with 404 status
          return res.status(404).json(errors)
      }
   Profile.findOne({user:req.user.id}).then(
       profile=>{
           
         const newExp={
             title:req.body.title,
             company:req.body.company,
             location:req.body.location,
             from:req.body.from,
             to:req.body.to,
             current:req.body.current,
             description:req.body.description,
         }
         //Add to experience array 
         profile.experience.unshift(newExp)
         profile.save().then(profile=>{res.json(profile) })
        
       }
   )
 })

//@routes POST api/profile/education
//@desc add education
//@access private
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validateEducationInput(req.body)

    //Check Validation
    if(!isValid){
        //return error with 404 status
        return res.status(404).json(errors)
    }
 Profile.findOne({user:req.user.id}).then(
     profile=>{
         
       const newEdu={
           school:req.body.school,
           degree:req.body.degree,
           fieldofstudy:req.body.fieldofstudy,
           from:req.body.from,
           to:req.body.to,
           current:req.body.current,
           description:req.body.description,
       }
       //Add to education array 
       profile.education.unshift(newEdu)
       profile.save().then(profile=>{res.json(profile) })
      
     }
 )
})


//@routes DELETE api/profile/experience/:exp_id
//@desc delete experience
//@access private
router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
 Profile.findOne({user:req.user.id}).then(
     profile=>{
         //get remove index
         const removeIndex=profile.experience
         .map(item=>item.id)
          .indexOf(req.params.exp_id)

          //splice out the array
          profile.experience.splice(removeIndex,1)

          //save
          profile.save().then(profile=>{res.json(profile)})
     }
 ).catch(err=>res.status(404).json(err))
})

//@routes DELETE api/profile/education/:edu_id
//@desc delete education
//@access private
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    Profile.findOne({user:req.user.id}).then(
        profile=>{
            //get remove index
            const removeIndex=profile.education
            .map(item=>item.id)
             .indexOf(req.params.edu_id)
   
             //splice out the array
             profile.education.splice(removeIndex,1)
   
             //save
             profile.save().then(profile=>{res.json(profile)})
        }
    ).catch(err=>res.status(404).json(err))
   })
   
 //@routes DELETE api/profile/
 //@desc delete user and profile
 //@access private

 router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
   Profile.findOneAndRemove({user:req.user.id})
   .then(()=>{
       User.findOneAndRemove({_id:req.user.id})
       .then(()=>{
           res.json({success:true})
       })
   })   
   })


    
module.exports = router
