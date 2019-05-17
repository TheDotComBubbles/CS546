let validate = require("./objectValidation");
const mongoCollections = require("../config/collections");
let venues = mongoCollections.venues;

let exportedMethods = {

 getAllVenues() {
    return venues()
    .then((venueCollection) => {
        return venueCollection.find({}).toArray()
        .then((allVenues) => {
            if(allVenues===undefined) throw "No Venues Found";
            return allVenues;
        });
    });
},

getVenueById(id) {   
    return validate.validateAndConvertId(id)
        .then((objectId) => {
            return venues()
            .then(venueCollection => {
                return venueCollection.findOne({"_id": objectId })
                .then(venue => {
                if (!venue) throw "WARN: " + "Could not find venue with id " + id;
                return venue;
                });
            });
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},

getVenueByName(name) {   
    return validate.verifyString(name)
        .then(() => {
            return venues()
            .then(venueCollection => {
                return venueCollection.findOne({"name": name })
                .then(venue => {
                if (!venue) throw "WARN: " + "Could not find venue with name " + name;
                return venue;
                });
            });
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},

getVenuesBySearchString(searchString) {   
    let rx = new RegExp(searchString)
    console.log("\n\n" + rx + "\n\n\n\n");
    return validate.verifyString(searchString)
        .then(() => {
            return venues()
            .then(venueCollection => {
                return venueCollection.find({ "name": { $regex: rx }}).toArray()
                .then(venueMatches => {
                    console.log("\n\n\n Here are the venues: \n" + venueMatches);
                if (!venueMatches) throw "WARN: " + "Could not find venue with search string " + searchString;
                return venueMatches;
                });
            })
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},

getVenueByLocation(location) {   
    return validate.verifyString(location)
        .then(() => {
            return venues()
            .then(venueCollection => {
                return venueCollection.findOne({"location": location })
                .then(venue => {
                if (!venue) throw "WARN: " + "Could not find venue with location " + location;
                return venue;
                });
            });
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},

getVenueByRating(rating) {   
    rating.forEach(function(x) {
        validate.verifyNum(x);
    });

    return venues()
    .then(venueCollection => {
        return venueCollection      
            .find({ rating: { $in: rating } })
            .toArray();
        })
        .then((venue) => {
        if (!venue) throw "WARN: " + "Could not find venue with ratings in " + rating;
        return venue;
        })
        .catch((error) => {
            console.log("ERROR: " + error);
        });
},

createVenue(name, location, style, description, rating) {

    return validate.verifyString(name, "name").then(() => {
        return validate.verifyString(location)}).then(() => {
            return venues}).then((venues) => {
                return venues().then((venueCollection) => {
                    let newVenue = {
                        //_id: "",
                        name: name,
                        location: location,
                        locationLatLong: {},
                        hours: "",
                        style: style, 
                        description: description,
                        rating: rating
                    }            
                    return venueCollection.insertOne(newVenue).then((insertInfo) => {
                        if(insertInfo.insertedCount === 0) throw "Could not add venue with name " + name + " and location; " + location;
                        return this.getVenueById(insertInfo.insertedId)
                });
            });
        }).catch((error) => {
            throw error;
    });
},

getVenueByHours(lowerRange, upperRange, dayOfTheWeek) {
    v.verifyNumber(lowerRange).then(() => 
        v.verifyNumber(upperRange)).then(() => {
            return venues().then((venueCollection)=> {
                return venueCollection.find({
                    $and: [
                        {"hours.dayOfTheWeek":  dayOfTheWeek},
                        {"hours.openingTime": { $lte: lowerRange}},
                        {"hours.closingTime": { $gt: upperRange}}
                    ]
                })
                .toArray();
            })
        })
    },

updateVenueStyle(id, newStyle) {
        v.verifyString(style).then(()=> {
            return venues()
            .update({ _id: id }, { $set: { "style": newStyle } })
            .then(function() {
              return getVenueById(id);
            });
        })
    } 
}

module.exports = exportedMethods;




