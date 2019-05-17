let validate = require("./objectValidation");
//let v = require("./objectValidation");
const mongoCollections = require("../config/collections");
let users = mongoCollections.users;
const bcrypt = require('bcrypt')

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

async create(firstName,lastName, email, phoneNumber, age, password, bday, ratedVenues) {
       
    if (!firstName|| typeof firstName != 'string') throw "You must provide a string of first name";

    if (!lastName|| typeof lastName != 'string') throw "You must provide a string of last name";

    if (!phoneNumber || typeof phoneNumber != 'string') throw "Please provide a proper 10 digit phone number";

    if (!email|| typeof email != 'string') throw "You must provide a string of email";

    if (!password|| typeof password != 'string') throw "You must provide a string of password";

    if (!age|| typeof age != 'number') throw "Age should be number"
   
    const userCollection = await users();
 
    var checkExist = await userCollection.find({email: email}).toArray();

    if(checkExist.length>=1){
       throw "Mail exists"
    }else{

    
        var tmp = await bcrypt.hash(password, 10).then(function (data) {return data}).catch(e=> {throw e;});
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            age: age,
            hashedPassword: tmp,
            bday: bday,
            ratedVenues:[],

            };
            const insertInfo = await userCollection.insertOne(newUser);
            if (insertInfo.insertedCount === 0) throw "Could not add user";

            const newId = insertInfo.insertedId;
            const user = await this.getUserById(newId);

            return user
       
    } 
  }
}
module.exports = exportedMethods;