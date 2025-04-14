import express from "express";
const app = express();
import mongoose from "mongoose";
const PORT = process.env.PORT || 8000;
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url"; 
import methodOverride from "method-override";
import dotenv from 'dotenv';
import ejsMate from "ejs-mate";
import asyncWrap from "./utils/asyncWrap.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";
dotenv.config();


// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Declare MONGO_URL properly
const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("MongoDB connected !!!");
  })
  .catch((err) => {
    console.log("mongoDB connection error: ", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
  console.log("hello i am from roote");
  res.send("Hello, I am from the root route!");
});

// backend listing validation
const validateListing = (req,res,next )=>{
  let { error } = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((e)=> e.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else{
    next();
  }
}

// index Route 
app.get("/listings", asyncWrap(async (req, res) => {
  let allListings = await Listing.find({});
  //console.log("listings works");
  res.render("listings/index", { allListings });
}));

// create page Route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new",);
})


// views Route 
app.get("/listings/:id",asyncWrap(async (req,res)=>{
  let {id} = req.params;
  //console.log({id});
  let listing = await Listing.findById(id);
  //console.log(listing);
  res.render("listings/show",{ listing })
}));

// create Route
app.post("/listings", validateListing, asyncWrap (async (req,res)=>{
  // if(!req.body.listing){
  //   throw new ExpressError(400, "send valid data for listing");
  // }
  let newListing = new Listing(req.body.listing); 
  await newListing.save();
  //console.log("successfull sends!!");
  res.redirect("/listings");
}));

// Edit Route 
app.get("/listings/:id/edit",asyncWrap(async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit",{listing});
}));


// Update Route
app.put("/listings/:id", validateListing, asyncWrap(async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id",asyncWrap(async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(`Deleted ==> ${deletedListing}`);
  res.redirect("/listings");
}));

//test Route
// app.get("testListing",async (req,res)=>{
//   let sampleListing = new Listing({
//     title: "New home Villa",
//     description: "This is a villa.",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull testing");
// })

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500, message="something went wrong!!!"} =err;
  res.status(statusCode).render("error",{message});
  // res.status(statusCode).send(message);
})
app.listen(PORT, () => {
  console.log(`app rendered on port http://localhost:${PORT}/listings`);
});
