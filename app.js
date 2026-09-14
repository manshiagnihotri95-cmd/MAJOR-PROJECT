if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
require('dotenv').config();
console.log(process.env.SECRET);
const express=require("express");
const session = require("express-session")
const app=express();
const dns = require("dns");
dns.setServers(["1.1.1.1", "0.0.0.0"]);
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const MongoStore = require("connect-mongo").default
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const dbUrl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

})
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const port=8080;
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"))
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
app.listen(port,()=>{
    console.log(`your port is listening ${port}`);
});
//pbkdf2 hashing alogorithm which we are implemented
