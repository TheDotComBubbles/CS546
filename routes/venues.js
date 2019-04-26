const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const venueData = data.venues;

  router.get("/", (req,res) => { 
    venueData.getAllVenues()
    .then((venues) => {
        res.render("pages/venues", {
            title: "All Venues",
            venues
        })
    }).catch(e => {
        res.status(400);
        res.render("pages/error", {
            title: "Invalid",
            error: e
        });
    });
  });

  
  router.post("/create", (req,res) => {
//
//see postMessage.js from lecture 7 assignment
    return venueData.createVenue(
            req.body.name,
            req.body.location,
            req.body.style,
            req.body.description
    ).then((venue) => {
        res.render("pages/venues", {
            title: "Thanks for adding the Venue " + venue.name,
            id: venue._id,
            venue
        });
    }).catch(e => {
        res.status(400);
        res.render("pages/error", {
            title: "Invalid",
            error: e
        });
    });
});

  router.post("/", (req,res) => {

    let searchTerm = req.body.venueName
    validate.verifyString(searchTerm)
    .then(name => {
        if(!searchTerm.length||!name) {
            res.status(400);
            res.render("pages/error", {
                title: "Invalid",
                searchTerm: searchTerm
            });
        }
        return venueData.getVenueByName(searchTerm)
    }).then((venue) => {
        res.render("pages/venue", {
            title: "Venues",
            venueName: user._id,
            user
        });
    }).catch(e => {
        res.status(400);
        res.render("pages/error", {
            title: "Invalid",
            searchTerm: searchTerm
        });
    });
});

module.exports = router;