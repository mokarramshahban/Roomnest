const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/roomnest";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    await initDB();
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

main().catch((err) => {
    console.log(err);
});