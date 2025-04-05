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
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
