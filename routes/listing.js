const express=require("express");
const listing=require("../controllers/listings.js");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer =require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing)
);
// .post(upload.single("listingimage"),(req,res)=>{
//     res.send(req.file);
//     console.log(req.file);
// })
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);
// router.get("/new", (req, res) => {
//     res.send("NEW ROUTE WORKING");
// });

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));
module.exports=router;