let validate = require("./objectValidation");
//let v = require("./objectValidation");
const mongoCollections = require("../config/collections");
let users = mongoCollections.users;

let exportedMethods = {
 getAllUsers() {

    return users()
    .then((userCollection) => {
        return userCollection.find({}).toArray()
        .then((allUsers) => {
            if(allUsers===undefined) throw "No Users Found";
            return allUsers;
        });
    });
},

getUserById(id) {
       
    return validate.validateAndConvertId(id)
        .then((objectId) => {
            return users()
            .then(userCollection => {
                return userCollection.findOne({ _id: objectId })
                .then(user => {
                if (!user) throw "WARN: " + "Could not find user with id " + id;
                return user;
                });
            });
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},

getUserByName(name) {
    validate.verifyString(name)
        return users()
        .then(userCollection => {
            return userCollection.findOne({ name: name })
            .then(user => {
            if (!user) throw "WARN: " + "Could not find user with name " + name;
            return user;
            });
          }).catch((error) => { 
        console.log("ERROR: " + error);
    });
},

getUserByDOB(dob) {
    validate.verifyString(dob)
        return users()
        .then(userCollection => {
            return userCollection.findOne({ dob: dob })
            .then(user => {
            if (!user) throw "WARN: " + "Could not find user with dob " + dob;
            return user;
            });
          }).catch((error) => { 
        console.log("ERROR: " + error);
    });
},

getUserByEmail(email) {
    //add regex for email
    validate.verifyString(email)
        return users()
        .then(userCollection => {
            return userCollection.findOne({ email: email })
            .then(user => {
            if (!user) throw "WARN: " + "Could not find user with email " + email;
            return user;
            });
          }).catch((error) => { 
        console.log("ERROR: " + error);
    });
},

getUserByPhoneNumber(phoneNumber) {
    //add regex for phone number
    validate.verifyString(phoneNumber)
        return users()
        .then(userCollection => {
            return userCollection.findOne({ phoneNumber: phoneNumber })
            .then(user => {
            if (!user) throw "WARN: " + "Could not find user with phoneNumber " + phoneNumber;
            return user;
            });
          }).catch((error) => { 
        console.log("ERROR: " + error);
    });
},

createUser(fname, lname, email, phoneNumber, age, dob, ratedVenues) {
    return validate.verifyString(name, "name")
        .then(() => {
            return users()
            .then((userCollection) => {
                let newUser = {
                    //_id: "",
                    fname: fname,
                    lname: lname,
                    email: email,
                    phoneNumber: phoneNumber,
                    age: age,
                    dob: dob,
                    ratedVenues: []
                }            
                return userCollection.insertOne(newUser)
                .then((insertInfo) => {
                    if(insertInfo.insertedCount === 0) throw "Could not add user with name " + name;
                    return this.getUserById(insertInfo.insertedId)
                });
            });
        }).catch((error) => {
            throw error;
        })
    }
}
module.exports = exportedMethods;