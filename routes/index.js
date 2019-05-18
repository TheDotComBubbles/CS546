const userRoutes = require("./users");
const detailsRoutes = require("./details");
const venueRoutes = require("./venues");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/details",detailsRoutes);
  app.use("/venues",venueRoutes);
  app.get("/test", (req,res) => { 
    let route = path.resolve("static/testLandingPage.html");
    res.sendFile(route);
  });

  // app.use("*", (req, res) => {
  //   res.render("pages/aboutUs");
  // });
  app.use("*", (req, res) => {
    res.render("pages/login");
  });
};

module.exports = constructorMethod;
