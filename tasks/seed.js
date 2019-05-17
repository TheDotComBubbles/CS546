const dbConnection = require("../config/connection");
const data = require("../data/");
const users = data.users;
const venues = data.venues;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    
    // name, location, style, description, rating

    const loc1 = await venues.createVenue("Saffron", "Ahmedabad", "Indian, Continental", "Blah blah", "4.7")
    console.log("added a venue", loc1)
    const loc2 = await venues.createVenue("XYzzz", "Mumbai", "Italian", "zoop zoop", "2")
    console.log("added a venue", loc2)
    console.log("Done seeding database");
    await db.serverConfig.close();
};

main().catch(console.log);
