

function buildSet(data)
{
    const map = new Map();

    for(const restaurant of data)
    {
        if(!map.has(restaurant.name))
            map.set(restaurant.name, [restaurant]);
        else
            map.get(restaurant.name).push(restaurant);
    }

    return map;
}

function euclidianDistance(googleRestaurant, yelpRestaurant)
{
    if(!googleRestaurant.longitude || !googleRestaurant.latitude || !yelpRestaurant.longitude || !yelpRestaurant.latitude)
        return Infinity;

    const longitudeDistance = (googleRestaurant.longitude - yelpRestaurant.longitude);
    const latitudeDistance = (googleRestaurant.latitude - yelpRestaurant.latitude);

    return Math.sqrt(longitudeDistance * longitudeDistance + latitudeDistance * latitudeDistance);
}

const epsilonDistanceHighest = 0.0001;
const epsilonDistanceHigh = 0.001;
const epsilonDistanceMedium = 0.01;

function computeCertanty(googleRestaurant, yelpRestaurants)
{
    const results = [];

    for(const yelpRestaurant of yelpRestaurants)
    {
        const distance = euclidianDistance(googleRestaurant, yelpRestaurant);

        if(distance < epsilonDistance)
        console.log(distance);

        if(googleRestaurant.phone === yelpRestaurant.phone || distance < epsilonDistanceHighest)
        {
            results.push({googleRestaurant, yelpRestaurant, certanty: "Highest"});
            continue;
        }      

        if(distance < epsilonDistanceHigh)
        {
            results.push({googleRestaurant, yelpRestaurant, certanty: "High"});
            continue;
        }

        if(distance < epsilonDistanceMedium)
        {
            results.push({googleRestaurant, yelpRestaurant, certanty: "Medium"});
            continue;
        }
    }

    return results;
}

module.exports = (googleData, yelpData) =>
{
    const googleSet = buildSet(googleData);
    const yelpSet = buildSet(yelpData);

    for(const [googleName, googleValues] of googleSet.entries())
    {
        if(!yelpSet.has(googleName))
            continue;
        
        const yelpValues = yelpSet.get(googleName);
        for(const googleValue of googleValues)
        {
            computeCertanty(googleValue, yelpValues);
        }
    }

}