const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const venueData = data.venues;

router.post("/", async (req, res) => {
    console.log("Hey you're in post route of search")
    console.log(req.body)
    console.log(req.body.searchtype)
    console.log(req.body.searchstring.trim())

    let type = req.body.searchtype
    let searchStr = req.body.searchstring.trim()

    let data 

    if (type === "name") {
        data = await venueData.getVenueByName(searchStr)
    } else if (type === "location") {
        data = await venueData.getVenueByLocation(searchStr)
    } else {
        let param = searchStr.split(",")
        console.log("Searching by rating")
        console.log("\nSearch string after splitting", param)
        param = param.map((x) =>Number(x));
        console.log(`Parameter sent:${param}`)
        data = await venueData.getVenueByRating(param)
    }
    console.log("Data found:", data)
    console.log(typeof data)

    if (data.length === 0) {
        res.render("pages/search",{hasErrors:true, title: "Search Result", foundData: data})
    } else {
        res.render("pages/searchResults", {hasErrors:false, title:"Search Result", foundData: data, searchStr: searchStr})
    }
})

module.exports = router;