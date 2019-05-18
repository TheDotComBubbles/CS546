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
        })
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
                return venueCollection.find({"name": name}).toArray()
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
                return venueCollection.find({"location": location }).toArray()
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
                        rating: rating,
                        reviews: []
                    }            
                    return venueCollection.insertOne(newVenue)
                    .then((insertInfo) => {
                        if(insertInfo.insertedCount === 0) throw "Could not add venue with name " + name + " and location; " + location;
                        return this.getVenueById(insertInfo.insertedId)
                });
            });
        }).catch((error) => {
            throw error;
    });
},

    addVenueReview(venueId, userId, review, rating) {
        console.log(venueId, userId, review, rating);
    return validate.verifyString(review).then(()=> {
        return validate.validateAndConvertId(venueId).then((venueObjectId)=> {
            return validate.validateAndConvertId(userId).then((userObjectId)=> {
                return validate.verifyNum(rating).then(()=> {
                    return venues().then(venueCollection=> {
                        return venueCollection.updateOne(
                            { _id: venueObjectId }, 
                            { $push: {reviews: {
                                userID: userObjectId, 
                                review: review,
                                rating: rating
                            }}}).then((insertInfo) => {
                                return this.getVenueById(venueObjectId).then(result => {
                                        if (!result) throw "WARN: " + "Could not find venue with id " + id;
                                        return result;
                                })
                                .then((updatedRecord)=> {
                                    if(insertInfo.insertedCount === 0) throw "Could not complete";
                                    return this.updateVenueAggregateRating(venueObjectId)
                                })
                            });
                        });
                    });
                });
            });
        }).catch((error) => {
            throw "Ran into an error " + error;
    });
},

updateVenueAggregateRating(venueId) {
    return validate.validateAndConvertId(venueId).then((venueObjectId)=> {
        return this.getVenueById(venueObjectId).then((venue) => {
            return ratingReducer(venue).then(aggRating => {            
                return venues().then(venuesCollection => {
                    return venuesCollection.updateOne(
                        { _id: venueObjectId }, 
                        { $set: { "rating": aggRating } 
                        }).then((result) => {
                            return this.getVenueById(venueObjectId).then(result => {
                                if (!result) throw "WARN: " + "Could not find venue with id " + id;
                                return result;
                            });
                        });
                    });
                });
            })
        }).catch((error) => {
            throw error;
    });
},


getVenueByHours(lowerRange, upperRange, dayOfTheWeek) {
    validate.verifyNumber(lowerRange).then(() => 
        validate.verifyNumber(upperRange)).then(() => {
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
        validate.verifyString(style).then(()=> {
            return venues()
            .update({ _id: id }, { $set: { "style": newStyle } })
            .then(function() {
              return getVenueById(id);
            });
        })
    } 
}

module.exports = exportedMethods;


async function ratingReducer(venue) {
    let len =  venue.reviews.length 
    let sum = 0;

    venue.reviews.forEach((x) => {
        sum = sum + x.rating
    });

    let aggRating = (sum/len);
    return Math.round(aggRating);
}




