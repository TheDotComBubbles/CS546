const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const userData = data.users;

/*
  router.get("/", (req,res) => { 
    let route = path.resolve("static/peopleFinder.html");
    res.sendFile(route);
  });
  */

 router.get("/", (req,res) => { 
    userData.getAllUsers()
    .then((users) => {
        res.render("pages/users", {
            title: "All Users",
            users
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

    let searchTerm = req.body.userIdSearch
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