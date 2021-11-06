function buildSet(data) {
  const map = new Map();

  for (const restaurant of data) {
    if (!map.has(restaurant.name)) map.set(restaurant.name, [restaurant]);
    else map.get(restaurant.name).push(restaurant);
  }

  return map;
}

function euclidianDistance(googleRestaurant, yelpRestaurant) {
  if (
    !googleRestaurant.longitude ||
    !googleRestaurant.latitude ||
    !yelpRestaurant.longitude ||
    !yelpRestaurant.latitude
  )
    return Infinity;

  const longitudeDistance =
    googleRestaurant.longitude - yelpRestaurant.longitude;
  const latitudeDistance = googleRestaurant.latitude - yelpRestaurant.latitude;

  return Math.sqrt(
    longitudeDistance * longitudeDistance + latitudeDistance * latitudeDistance
  );
}

const epsilonDistanceHighest = 0.0001;
const epsilonDistanceHigh = 0.001;
const epsilonDistanceMedium = 0.01;

function computeCertainty(googleRestaurant, yelpRestaurants) {
  const results = [];

  for (const yelpRestaurant of yelpRestaurants) {
    const distance = euclidianDistance(googleRestaurant, yelpRestaurant);

    const bothHavePhoneNumbers =
      googleRestaurant.phone !== "" && yelpRestaurant.phone !== "";

    // if they both have a phone number but the phone numbers are different
    // let's asume a medium match
    if (
      bothHavePhoneNumbers &&
      googleRestaurant.phone !== yelpRestaurant.phone &&
      distance < epsilonDistanceMedium
    ) {
      results.push({ googleRestaurant, yelpRestaurant, certainty: "Medium" });
    }
    // if they both have the same phone numbers we asume a Highest
    else if (
      (bothHavePhoneNumbers &&
        googleRestaurant.phone === yelpRestaurant.phone) ||
      distance < epsilonDistanceHighest
    ) {
      results.push({ googleRestaurant, yelpRestaurant, certainty: "Highest" });
    } else if (distance < epsilonDistanceHigh) {
      results.push({ googleRestaurant, yelpRestaurant, certainty: "High" });
    } else if (distance < epsilonDistanceMedium) {
      results.push({ googleRestaurant, yelpRestaurant, certainty: "Medium" });
    }
    // if we don't have the coordonates for one of the restaurant assume medium
    else if (!isFinite(distance)) {
      results.push({ googleRestaurant, yelpRestaurant, certainty: "Medium" });
    }

    // else ignore them, they are too far away
  }

  return results;
}

module.exports = (googleData, yelpData) => {
  const googleSet = buildSet(googleData);
  const yelpSet = buildSet(yelpData);

  let results = [];

  for (const [googleName, googleValues] of googleSet.entries()) {
    if (!yelpSet.has(googleName)) continue;

    const yelpValues = yelpSet.get(googleName);
    for (const googleValue of googleValues) {
      results = [...results, ...computeCertainty(googleValue, yelpValues)];
    }
  }

  return results;
};
