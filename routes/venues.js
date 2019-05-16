const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.get("/", async (req, res) => {
    res.render("pages/home", {title:"Home"})
})

module.exports = router;