const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")

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

app.get("/", (req, res) => {
    res.send("Hello, I am root");
})

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing ({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        coutry: "India",
    });
    await sampleListing.save();
    console.log("Listing saved successfully");
    res.send("Test Listing saved successfully");
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})