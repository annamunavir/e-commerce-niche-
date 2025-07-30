const mongoose =require('mongoose');


const testimonialSchema =new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
     unique: true,
  },
  feedback:{
    type:String,
    required:true
  }
},{timestamps:true})

module.exports =mongoose.model('testimonial',testimonialSchema)