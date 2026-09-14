const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");
const axios=require("axios");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url:String,
       filename:String,

    },
    price:{
        type:Number,
        default:0
    },
    location:String,
    country:String,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            // required:true
        },
        coordinates:{
            type:[Number],
            // required:true
        },
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","deserts"]
    // }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;