const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const venueData = data.venues;

  router.get("/", (req,res) => { 
    let route = path.resolve("static/peopleFinder.html");
    res.sendFile(route);
  });

  router.post("/", (req,res) => {

    let searchTerm = req.body.venueName
    validate.verifyString(searchTerm)
    .then(name => {
        if(!searchTerm.length||!name) {
            res.status(400);
            res.render("error", {
                title: "Invalid",
                searchTerm: searchTerm
            });
        }
        return venueData.getVenueByName(searchTerm)
    }).then((venue) => {
        res.render("venue", {
            title: "Venues",
            venueName: user._id,
            user
        });
    }).catch(e => {
        res.status(400);
        res.render("error", {
            title: "Invalid",
            searchTerm: searchTerm
        });
    });
});

module.exports = router;