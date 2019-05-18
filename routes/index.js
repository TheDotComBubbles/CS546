const userRoutes = require("./users");
const venuesRoutes = require("./venues");
const searchRoutes = require("./search");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);

  //add userid as req param in venues search and about us while the user is logged in and home2 
  app.use("/:userid/venues",venuesRoutes);
  app.use("/:userid/search", searchRoutes);
  
  //add userid as a tag in the below route
  app.get("/:userid/home", async (req, res) => {
    res.render("pages/home", {title:"Home"})
})
  // app.get("/test", (req,res) => { 
  //   let route = path.resolve("static/testLandingPage.html");
  //   res.sendFile(route);
  // });

  // app.use("*", (req, res) => {
  //   res.render("pages/aboutUs");
  // });
  app.use("*", (req, res) => {
    res.render("pages/login");
  });
};

module.exports = constructorMethod;
