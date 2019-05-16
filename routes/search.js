const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const venueData = data.venues;

router.post("/", async (req, res) => {
    console.log("Hey you're in post route of home")
    console.log(req.body)
    console.log(req.body.searchtype)
    console.log(req.body.searchstring.trim())

    let type = req.body.searchtype
    let searchStr = req.body.searchstring.trim()

    let data 

    if (type === "name") {
        data =venueData.getVenueByName(searchStr)
    } else if (type === "location") {
        data = venueData.getVenueByLocation(searchStr)
    } else {
        data = venueData.getVenueByRating(searchStr)
    }

    console.log(typeof data)
    res.render("pages/searchResults", {title:"Search Result"})
})

module.exports = router;