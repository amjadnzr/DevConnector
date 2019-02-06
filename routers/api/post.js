const express = require('express')
const router= express.Router();
const mongoose=require('mongoose')
const passport=require('passport')

//Post model
const Post=require('../../models/Post')
//Profilet model
const Profile=require('../../models/Profile')


//Validation
validatePostInput=require('../../validation/post')
//@routes GET api/post/test
//@desc testing post routes
//@access public
router.get('/test',(req,res)=>{
   res.json({msg:"post is loaded"})
}) 

//@routes GET api/post
//@desc get posts
//@access public

router.get('/', (req,res)=>{
  Post.find()
  .sort({date:-1})
  .then(posts=> res.json(posts))
  .catch(err=>res.status(404).json({nopostsFound:"No posts found"}))
})

//@routes GET api/post/:id
//@desc get post by it's id
//@access public

router.get('/:id', (req,res)=>{
    Post.findById(req.params.id)
    .then(post=> res.json(post))
    .catch(err=>res.status(404).json({nopostsFound:"No posts found"}))
  })

//@routes POSTT api/posts
//@desc Create post
//@access private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const{errors,isValid} = validatePostInput(req.body)
    
    //check validation
    if(!isValid){
        //if any error send 400 status with errors object
      return res.status(400).json(errors)
    }
    const newPost = new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    })

    newPost.save().then(post=>{res.json(post)})
 }) 
 
 //@routes DELETE api/post/:id
 //@desc Delete Post
 //@access private

 router.delete("/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
 //checking whether the authorized person is the owner of the post
   Profile.findOne({user:req.user.id})
   .then(profile=>{
     Post.findById(req.params.id)
     .then(post=>{
       //check for post owner
       if(post.user.toString() !==req.user.id){
         return res.status(401).json({notauthorized:"User not Authorized"})
       }

       //Delete
       post.remove().then(()=>{res.json({success:true})})
     })
     .catch(err=>res.status(404).json({postnotfound:"No Post Found"}))
   }) 
 })


 //@routes POST api/post/like/:id
 //@desc Like post
 //@access private

 router.post("/like/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
  //checking whether the authorized person is the owner of the post
    Profile.findOne({user:req.user.id})
    .then(profile=>{
      Post.findById(req.params.id)
      .then(post=>{
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
          //id exist
          return res.status(401).json({alreadyliked:"Useer already liked it"})
        }
        //Add user id to likes array
        post.likes.unshift({user:req.user.id})
        
        post.save().then(post=>res.json(post) )
      })
      .catch(err=>res.status(404).json({postnotfound:"No Post Found"}))
    }) 
  })

 //@routes POST api/post/unlike/:id
 //@desc Unlike post
 //@access private

 router.post("/unlike/:id",passport.authenticate('jwt',{session:false}),(req,res)=>{
  //checking whether the authorized person is the owner of the post
    Profile.findOne({user:req.user.id})
    .then(profile=>{
      Post.findById(req.params.id)
      .then(post=>{
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
          //id doesn't exist
          return res.status(401).json({notliked:"User has not liked"})
        }
        //Get remove index
        const removeIndex= post.likes
          .map(item=>item.user.toString())
          .indexOf(req.user.id)

        //splice out the array
        post.likes.splice(removeIndex,1)

        //save
        post.save().then(post=>{
          res.json(post)
        })
      })
      .catch(err=>res.status(404).json({postnotfound:"No Post Found"}))
    }) 
  })
 
//@routes POST api/post/comment/:id(post id)
//@desc Comment on a post
//@access private
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

  const{errors,isValid} = validatePostInput(req.body)
    
  //check validation
  if(!isValid){
      //if any error send 400 status with errors object
    return res.status(400).json(errors)
  }

  Post.findById(req.params.id)
  .then(post=>{
    const newComment={
      text:req.body.text,
      name:req.body.name,
      avatar:req.body.avatar,
      user:req.user.id
    }
   // Add to comment array using unshift()
    post.comments.unshift(newComment)
    //save
    post.save().then(post=>res.json(post))
  })
  .catch(err=>res.json({postnotfound:"No Post Found"}))
})


//@routes DELETE api/post/comment/:id(post id)/:comment_id
//@desc Remove comment on a post
//@access private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

   Post.findById(req.params.id)
  .then(post=>{
    //Check whether the post exist
    if(post.comments.filter(comment => comment._id.toString()===req.params.comment_id).length===0){
      return res.status(404).json({commentnotexist:"Comment not found"})
    } 

    //Get Remove index
    const removeIndex=post.comments
    .map(item=> item._id.toString())
    .indexOf(req.params.comment_id)

    //Splice it off the array
    post.comments.splice(removeIndex,1)

    //save
    post.save().then(post=> res.json(post))
  })
  .catch(err=>res.json({postnotfound:"No Post Found"}))
})


 

module.exports = router