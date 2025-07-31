const express =require('express');
const router=express.Router()
const auth =require('../middleware/auth');
const User = require('../models/user'); // 👈 match the actual filename
const testimonial = require('../models/testimonial');



//add new feedBack
router.post('/',auth,async(req,res)=>{
  const {feedback}=req.body;
 
   try {
     const user=await User.findById(req.userId);
     if(!user){
      return res.status(404).json({message:"user not found"})
     }

    const existingFeedback = await testimonial.findOne({user:user._id})
    if(existingFeedback){
      return res.status(400).json({message:"you already given feedback"})
    }
    const newFeedBack =new testimonial({
      user:user._id,
      feedback,
    })
    await newFeedBack.save();
    const populatedFeedback = await testimonial.findById(newFeedback._id).populate("user", "userName profile.avatar");

    res.status(201).json({message:"feedback added successfully",feedback: populatedFeedback})
   } catch (error) {
    res.status(500).json({message: 'error adding feedback',error:error.message})
   }
})

router.get('/',async (req,res)=>{
  try {
    const feedbacks =await testimonial.find()
    .populate("user",'userName email profile.avatar ')
    res.json(feedbacks)
  } catch (error) {
    res.status(500).json({message:"Failed to fetch feedbacks",error:error.message})
  }
})


router.put("/edit",auth,async(req,res)=>{
  const {feedback}=req.body;
  try {
    const updated =await testimonial.findOneAndUpdate(
      {user:req.userId},
      {feedback},
      {new:true}
    );
    if(!updated){
      return res.status(404).json({message:"no feedback found to update"})
    }
    res.json({message:"feedback updated successfully",feedback:updated})
  } catch (error) {
    res.status(500).json({message:'error updating feedback',error:error.message})
  }
})


router.delete('/delete',auth,async(req,res)=>{

  try {
    const deleted =await testimonial.findOneAndDelete({user:req.userId});
    if(!deleted){
      return res.status(404).json({message:"no feedback found to delete"})
    }
    res.json({message:"feedback deleted successfully",deleted})
  } catch (error) {
    
  }
})

module.exports = router;