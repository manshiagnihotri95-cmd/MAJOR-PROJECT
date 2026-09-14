const express=require("express");
const passport=require("passport"); 
const router=express.Router({}); 
// const Review=require("../models/review.js");
const controllersUser=require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");
router.route("/signup")
.get((controllersUser.renderSignupForm))
.post((controllersUser.signup));
router.route("/login")
.get((controllersUser.renderloginForm))
.post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),
    controllersUser.login
);
router.get("/logout",(controllersUser.renderlogoutForm));
module.exports=router;