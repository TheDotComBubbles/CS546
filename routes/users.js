const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const userData = data.users;

  router.get("/", (req,res) => { 
    let route = path.resolve("static/peopleFinder.html");
    res.sendFile(route);
  });

  router.post("/create", (req,res) => {
      userData.createUser(req.body.name)
      .then((user) => {
          res.render("pages/user", {
              title: "Thanks For Adding: " + req.body.name,
              user
          })
      }).catch(e => {
        res.status(400);
        res.render("pages/error", {
            title: "Invalid",
            searchTerm: req.body.name + e
        });
    });
})

  router.post("/", (req,res) => {

    let searchTerm = req.body.userId
    validate.validateAndConvertId(searchTerm)
    .then(id => {
        if(!searchTerm.length||!id) {
            res.status(400);
            res.render("pages/error", {
                title: "Invalid",
                searchTerm: searchTerm
            });
        }
        return userData.getUserById(searchTerm)
    }).then((user) => {
        res.render("pages/user", {
            title: "Users",
            userId: user._id,
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