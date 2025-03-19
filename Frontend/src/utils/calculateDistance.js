export const calculateDistance = (userLocation, listingLocation) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRadians(listingLocation.latitude - userLocation.latitude);
    const dLon = toRadians(listingLocation.longitude - userLocation.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(userLocation.latitude)) *
        Math.cos(toRadians(listingLocation.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance.toFixed(1); // Round to 1 decimal place
  };