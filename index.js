var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

const csvParse = require('./src/csvParser');

async function main() {
    const googleData = await csvParse('./data/Google.csv');
    const yelpData = await csvParse('./data/Yelp.csv');

    console.log({googleData});
    console.log({yelpData});

    db.serialize(function() {
        db.run("CREATE TABLE googleRestaurants (name TEXT, phone TEXT, latitude REAL, longitude REAL)");
        db.run("CREATE TABLE yelpRestaurants (name TEXT, phone TEXT, latitude REAL, longitude REAL)");
        db.run("CREATE TABLE restaurantMatches (googleRestaurantId INTEGER NOT NULL, yelpRestaurantId INTEGER NOT NULL, certainty TEXT CHECK(certainty IN ('Highest','High','Medium')))");

        // insert google data
        const googleStmt = db.prepare("INSERT INTO googleRestaurants(name, phone, latitude, longitude) VALUES (?, ?, ?, ?)");
        for (const restaurant of googleData) {
            googleStmt.run([restaurant.name, restaurant.phone, restaurant.latitude, restaurant.longitude]);
        }    
        googleStmt.finalize();

        // insert yelp data
        const yelpStmt = db.prepare("INSERT INTO yelpRestaurants(name, phone, latitude, longitude) VALUES (?, ?, ?, ?)");
        for (const restaurant of googleData) {
            yelpStmt.run([restaurant.name, restaurant.phone, restaurant.latitude, restaurant.longitude]);
        }    
        yelpStmt.finalize();
    });

    db.close();
}

main();
