const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const initData = require("./init/data.js"); // Add this line
const initIndex = require("./init/index.js"); // Add this line

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/roomnest";

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hello, I am root");
});

//index route
app.get("/listings", async (req, res) => {
   const allListings =  await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});
//New Route
app.get("/listings/new", (req, res) => {
     res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});
//Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// Temporary Route to Seed the Database
app.get("/seed", async (req, res) => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Database seeded with sample data.");
        res.send("Database seeded successfully! You can now check the listings page.");
    } catch (err) {
        console.error("Database seeding failed:", err);
        res.status(500).send("Database seeding failed: " + err.message);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke! " + err.message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});