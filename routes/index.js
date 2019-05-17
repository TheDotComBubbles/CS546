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

  app.use("*", (req, res) => {
    res.sendFile(path.resolve("static/login.html"));
  });
};

module.exports = constructorMethod;
