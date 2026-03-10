import mongoose from "mongoose";

const promoBannerSchema = new mongoose.Schema({

 image:{
  type:String,
  required:true
 },

 order:{
  type:Number,
  default:1
 }

},{timestamps:true});

const promoBannerModel =
mongoose.models.promoBanner ||
mongoose.model("promoBanner",promoBannerSchema);

export default promoBannerModel;