export const displayMap = locations => {
  // console.log('welcome to the map!!!');

  mapboxgl.accessToken = 'pk.eyJ1IjoiZGlzaGViaCIsImEiOiJjazlmc3Z1bmUwZ21lM3FudXFqOWVlODdwIn0.8YsrTHzK45WOmMwgALcN8Q';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dishebh/ck9ft6mk60y3h1it3ktv7vrfy',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add a marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a pop-up
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

};
