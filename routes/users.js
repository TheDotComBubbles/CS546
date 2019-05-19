const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const checkCookie = require('../middleware/check_cookie')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.get("/registration", checkCookie, async (req, res) => {
  console.log("sign up")
  req.flash('error','')
  res.status(200).render("pages/registration",{error:false})
});

router.get("/logout", checkCookie, async (req, res) => {
  console.log("sign out")
  
  res.status(200).render("pages/login")
});

router.get("/profile", checkCookie, async (req, res) => {
  console.log("profile")
  res.status(200).render("pages/profile")
});

router.get("/logon", checkCookie, async (req, res) => {
  console.log("sign in")
 

  res.status(200).render("pages/login", {
    title:"Signup Page",
  });
});

router.get("/logout", checkCookie, async (req, res) => {
  // console.log("sign in")
  if(req.session.user){
    res.clearCookie('user_sha')
    res.redirect('/pages/login')
  }else{
    res.redirect('/pages/login')
  }
})

router.get("/about", checkCookie, async (req, res) => {
  console.log("sign in")
  res.status(200).render("pages/aboutUS", {
    title:"AboutUs",
  });
});

  router.post("/registration", async (req,res) =>{
    try{
   console.log(req.body)
          if(req.body.fname ==  '' || req.body.lname == '' || req.body.phone == '' || req.body.email == '' || req.body.password == '' || req.body.age == '' || req.body.bday == '') throw 'Please fill all fields'
         
          if(req.body.password != req.body.confirm) throw "Password doesn't match"
     
          //test illegal email
          var mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          if(!mail.test(req.body.email)) throw "email format is not correct"
  
          //test illegal phone number
          var phoneno = /^\d{10}$/;
          if(!req.body.phone.match(phoneno)) throw "Phone number format is not correct"
     
          
          //test illegal first name and last name
          var format_name = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
          if(format_name.test(req.body.fname) || format_name.test(req.body.lname)) throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in firstname or lastname";
     
          //test illegal password format
          var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          if(format.test(req.body.password)) throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in password";
     
          const user = await userData.create(req.body.fname, req.body.lname, req.body.email, req.body.phone, Number(req.body.age), req.body.password, req.body.bday)
       
          res.status(200).redirect(`/${user._id}/home`)      
        
    }catch(e){
      req.flash('error', e)
      res.redirect('/users/registration')
  }
});

router.post("/login", async (req, res) => {
  try{
    console.log(req.body)
      if(req.body.email ==  '' || req.body.password ==  '' ) throw 'Please fill all fields'
        
        const user = await userData.login(req.body.email, req.body.password)
        let userId = user.user[0]._id

        res.cookie('token', user['token']);
        res.cookie('userid', user['user'][0]._id);
        res.status(200).redirect(`/${userId}/home`)    
  }catch(e){
    req.flash('error', e)
    res.redirect('/users/login')
        }
  });

module.exports = router;
