const express = require("express");
const v = require("../data/objectValidation");
const router = express.Router();

  router.get("/:id", (req,res) => { 
    try{
        v.validateAndConvertId(req.params.id)
        .then((objectId) => {
            let data = utils.getJsonFromURL(peopleUrl);
            return data
        }).then((data)=> {
            let person = data.find((p) => {
                if(p.id == req.params.id) {
                    return p
                };
            });
            return person;
        }).then((person) => {
            res.render("pages/person", {
                title: "Person Found",
                personName: person.firstName + ' ' + person.lastName,
                person
            }); 
        }).catch((error) => {
            res.status(500).json({error});
        })
    }
    catch(error)
    {
        res.status(404).json({error});
    }
  });

  module.exports = router;