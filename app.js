const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/roomnest";

main()
   .then(() => {
    console.log("Connected to MongoDB");
   })
   .catch((err) => {
     console.log(err);
   });

   async function main() {
    await mongoose.connect(MONGO_URL);
   }

   app.set("view engine", "ejs");
   app.set("views", path.join(__dirname, "views"));
   app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello, I am root");
})

//index route
app.get("/listings", async (req, res) => {
   const allListings =  await Listing.find({});
     res.render("listings/index.ejs", {allListings});
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         coutry: "India",
//     });
//     await sampleListing.save();
//     console.log("Listing saved successfully");
//     res.send("Test Listing saved successfully");
// });

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})