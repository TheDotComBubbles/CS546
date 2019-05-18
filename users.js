const express = require("express");
const validate = require("../data/objectValidation");
const path = require("path");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const checkCookie = require('../middleware/check_cookie')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/*
  router.get("/", (req,res) => { 
    let route = path.resolve("static/peopleFinder.html");
    res.sendFile(route);
  });
  */

//  router.get("/", (req,res) => { 
//     userData.getAllUsers()
//     .then((users) => {
//         res.render("pages/users", {
//             title: "All Users",
//             users
//         })
//     }).catch(e => {
//         res.status(400);
//         res.render("pages/error", {
//             title: "Invalid",
//             error: e
//         });
//     });
//   });
router.get("/registration", checkCookie, async (req, res) => {
  console.log("sign up")
 

  res.status(200).sendFile(path.resolve("static/registration.html")), {

    title:"Signup Page",
 
  };
});


  router.post("/registartion", async (req,res) =>{
    try{
   console.log(req.body)
          if(req.body.fname ==  '' || req.body.lname == '' || req.body.phone == '' || req.body.email == '' || req.body.password == '' || req.body.age == '' || req.body.bday == '') throw 'Please fill all fields'
         
          if(req.body.password !== req.body.confirm) throw "Password doesn't match"
     
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
          // const token = jwt.sign({/////////put tolen in the data
          //   email: user.email ,
          //   userId: user._id
          // },
          // process.env.JWT_KEY,
          //     {
          //         expiresIn: "1h"
          //     }
          // )
     
          // res.cookie('token', token);
          // res.cookie('userid', user._id);
       
          res.status(200).sendFile(path.resolve("static/login.html"))     
          // res.status(200).render("Component/homepage", {
          //   title:"Home Page",
          //   user: user
          // })    
        
    }catch(e){
      res.status(400).sendFile(path.resolve("static/registration.html")) 
      // res.status(400).json({
      //   error:e
      // })
  }
});

router.post("/login", async (req, res) => {
  try{
    console.log(req.body)
      if(req.body.email ==  '' || req.body.password ==  '' ) throw 'Please fill all fields'
        
        const user = await userData.login(req.body.email, req.body.password)
       
        
        res.cookie('token', user['token']);
        res.cookie('userid', user['user'][0]._id);
        res.status(200).sendFile(path.resolve("static/login.html"))     
      
    
       
      
  }catch(e){
      res.status(400).sendFile(path.resolve("static/login.html"),{
          hasErrors:true,
          error : e,
      })
      // res.status(400).json({
      //   error:e
      // })
  }
});
//   router.post("/", (req,res) => {

//     let searchTerm = req.body.userIdSearch
//     validate.validateAndConvertId(searchTerm)
//     .then(id => {
//         if(!searchTerm.length||!id) {
//             res.status(400);
//             res.render("pages/error", {
//                 title: "Invalid",
//                 searchTerm: searchTerm
//             });
//         }
//         return userData.getUserById(searchTerm)
//     }).then((user) => {
//         res.render("pages/user", {
//             title: "Users",
//             userId: user._id,
//             user
//         });
//     }).catch(e => {
//         res.status(400);
//         res.render("pages/error", {
//             title: "Invalid",
//             searchTerm: searchTerm
//         });
//     });
// });

module.exports = router;