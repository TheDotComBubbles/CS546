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

createVenue(name, location, style, description) {

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
                        description: description
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




