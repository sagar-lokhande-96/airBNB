import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

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

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    //console.log(sampleListings);
    console.log("data was successfull initialized");
}

initDB();