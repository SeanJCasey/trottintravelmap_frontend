export function slugifyString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

export function calculateStatsForPlaces(places) {
  let stats = {
    'area': 0,
    'placeCount': 0,
    'countryCount': 0,
    'continentCount': 0,
    'regionCount': 0
  };
  if (places.length) {
    const countryIdSet = new Set();
    const continentIdSet = new Set();
    const regionSet = new Set();
    for (const place of places) {
      // If country hasn't been added, add its area to the tally
      if (!countryIdSet.has(place.country.id)) {
        stats['area'] += place.country.area;
        countryIdSet.add(place.country.id);
      }

      // Add country, continent, and regions to sets to track unique items
      continentIdSet.add(place.continent);
      regionSet.add(place.region);
    }
    stats['placeCount'] = places.length;
    stats['countryCount'] = countryIdSet.size;
    stats['continentCount'] = continentIdSet.size;
    stats['regionCount'] = regionSet.size;
  }
  return stats;
}

export function calculateStatsForPlacesByIDs(placeIDs, places) {
  let placesVisitedObjects = []
  if (places.length) {
    placesVisitedObjects = placeIDs.map(placeID =>
      places.find(place => place.id === placeID)
    );
  }
  return calculateStatsForPlaces(placesVisitedObjects);
}
