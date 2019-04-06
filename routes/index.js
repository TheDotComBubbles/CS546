const userRoutes = require("./users");
const detailsRoutes = require("./details");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/details",detailsRoutes);
  app.get("/", (req,res) => { 
    let route = path.resolve("static/testLandingPage.html");
    res.sendFile(route);
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
