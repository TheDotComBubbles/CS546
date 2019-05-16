const userRoutes = require("./users");
const venuesRoutes = require("./venues");
const searchRoutes = require("./search");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/venues",venuesRoutes);
  app.use("/search", searchRoutes);
  
  app.get("/home", async (req, res) => {
    // console.log(req.body.searchtype)
    // console.log(req.body.searchstring)
    res.render("pages/home", {title:"Home"})
})
  app.get("/test", (req,res) => { 
    let route = path.resolve("static/testLandingPage.html");
    res.sendFile(route);
  });

  app.use("*", (req, res) => {
    res.render("pages/workInProgress", {})
  });
};

module.exports = constructorMethod;
