const express = require("express");
const router = express.Router();
const data = require("../data");
const venue = data.venues;
const user = data.users
const ObjectID = require("mongodb").ObjectID
const xss = require("xss")


router.get("/:venueid", async(req, res) => {
    try {
        console.log("In Venues GET route")
        let venueId = ObjectID(req.params.venueid)
        const venueData = await venue.getVenueById(venueId)
        console.log("Venue found: ", venueData)
        
        res.render('pages/details', { title: "Venue Details", foundName: venueData.name, details: venueData, venueID: venueId });
  
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.post("/:venueid/reviewadded", (req, res) => {
    //add review to the user and venue database
    //user db -->   1. search by user id
    //              2. add venueid in the array
    //venue db -->  1. search by venueid
    //              2. add userid, review, rating as object in review
    let venueID = req.params.venueid
    let rating = req.body.ratingVal
    let review = req.body.reviewContent
    console.log("\n\n#################In venues POST route...")
    console.log(`VenueID:${venueID}\nRating:${rating}\nReview:${review}`)

    //await venue.addVenueReview(venueID, userID, review, rating)
    res.json({success: true, message: xss(review)});
})

module.exports = router;