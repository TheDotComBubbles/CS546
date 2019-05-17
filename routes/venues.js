const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const venue = data.venues;
const ObjectId = require('mongodb').ObjectID;


router.get("/:id", async(req, res) => {
    // try {
        console.log("In Venues GET route")
        let venueId = ObjectId(req.params.id)
        const venueData = await venue.getVenueById(venueId)
        console.log("Venue found: ", venueData)
        res.render('pages/details',{title: "Venue Details", foundName: venueData.name, details: venueData });
   
    // } catch (error) {
    //     res.status(500).json({error: error})
    // }
})

module.exports = router;