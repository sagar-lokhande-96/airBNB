import express from "express";
const app = express();
import mongoose from "mongoose";
const PORT = process.env.PORT || 8000;
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url"; 
import methodOverride from "method-override";
import dotenv from 'dotenv';
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

app.get("/", (req, res) => {
  console.log("hello i am from roote");
  res.send("Hello, I am from the root route!");
});

// index Route 
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  //console.log("listings works");
  res.render("listings/index", { allListings });
});

// create Route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new",);
})


// views Route 
app.get("/listings/:id",async (req,res)=>{
  let {id} = req.params;
  //console.log({id});
  let listing = await Listing.findById(id);
  //console.log(listing);
  res.render("listings/show",{ listing })
})

// add Route
app.post("/listings",async (req,res)=>{
  //let listing = req.body.listing;
  let newListing = new Listing(req.body.listing); 
  await newListing.save();
  //console.log("successfull sends!!");
  res.redirect("/listings");
})

// Edit Route 
app.get("/listings/:id/edit",async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit",{listing});
});


// Update Route
app.put("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});


app.listen(PORT, () => {
  console.log(`app rendered on port http://localhost:${PORT}/listings`);
});
