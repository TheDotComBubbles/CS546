const userRoutes = require("./users");
const venuesRoutes = require("./venues");
const searchRoutes = require("./search");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/venues",venuesRoutes);
  app.use("/search", searchRoutes);
  
  //add userid as a tag in the below route
  app.get("/home", async (req, res) => {
    res.render("pages/home", {title:"Home"})
})
  app.get("/test", (req,res) => { 
    let route = path.resolve("static/testLandingPage.html");
    res.sendFile(route);
  });

  app.use("*", (req, res) => {
    res.render("pages/home", {})
  });
};

module.exports = constructorMethod;
