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
        //Is Try Catch necessary here? 
        console.log("ERROR: " + error);
    });
},

createUser(name) {

    return validate.verifyString(name, "name")
        .then(() => {
            return users()
            .then((userCollection) => {
                let newUser = {
                    //_id: "",
                    name: name,
                    likes: []
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