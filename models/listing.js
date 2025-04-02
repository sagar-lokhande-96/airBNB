import mongoose from "mongoose";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/mountain-peak-illuminated-at-sunset-over-forest-0r_37j49VZk",
        set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/mountain-peak-illuminated-at-sunset-over-forest-0r_37j49VZk"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
