const express = require("express");
const router = express.Router();
const data = require("../data");
const venue = data.venues;
const ObjectID = require("mongodb").ObjectID
const xss = require("xss")

router.get("/:venueid", async(req, res) => {
    try {
        console.log("In Venues GET route")
        let venueId = ObjectID(req.params.venueid)
        const venueData = await venue.getVenueById(venueId)
        console.log("Venue found: ", venueData)
        res.render('pages/details',{title: "Venue Details", foundName: venueData.name, details: venueData, venueID: venueId });
   
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.post("/:venueid/reviewadded", async (req, res) => {
    //add review to the user and venue database
    //user db -->   1. search by user id
    //              2. add venueid in the array
    //venue db -->  1. search by venueid
    //              2. add userid, review, rating as object in review
    let venueID = req.params.venueid
    let rating = req.body.rating
    let review = req.body.content
    console.log("\n\nIn venues POST route...")
    console.log(`VenueID:${venueID}\nRating:${rating}\nReview:${review}`)
    res.json({ success: true, message: xss(req.body.content) });

})

module.exports = router;