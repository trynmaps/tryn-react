import { GeoJsonLayer, IconLayer } from 'deck.gl';

// Icon Layer atlas icon
const atlasIcon = require('./res/icon-atlas.png');
const busIconWest = require('./res/icon-bus-west.png');
const busIconEast = require('./res/icon-bus-east.png');

const ICON_MAPPING = {
  marker: {
    x: 0, y: 0, width: 128, height: 128, mask: true,
  },
};

export function getStopMarkersLayer(route) {
  /* returns new DeckGL Icon Layer displaying all stops on given routes */

  // Push stop markers into data array
  const data = route.stops.map(stop => ({
    position: [stop.lon, stop.lat],
    icon: 'marker',
    size: 72,
    color: [255, 0, 0],
  }));

  return (new IconLayer({
    id: 'stop-icon-layer',
    data,
    iconAtlas: atlasIcon,
    iconMapping: ICON_MAPPING,
  }));
}

export function getRoutesLayer(geojson) {
  return (new GeoJsonLayer({
    id: 'muni-routes-geojson',
    data: {
      ...geojson,
    },
    lineWidthScale: 8,
    filled: true,
    stroked: true,
    extruded: true,
  }));
}

export function getVehicleMarkersLayer(route, displayVehicleInfo, angleDir) {
  /* returns new DeckGL Icon Layer displaying all vehicles on given routes */
  const data = route.routeStates[0].vehicles.reduce((callback, vehicle) => {
    if (Math.abs(angleDir - vehicle.heading) < 90) {
      callback.push({
        position: [vehicle.lon, vehicle.lat],
        icon: 'marker',
        size: 128,
        angle: angleDir - vehicle.heading,
        color: [0, 0, 255],
        // added vid & heading info to display onClick pop-up
        vid: vehicle.vid,
        heading: vehicle.heading,
      });
    }
    return callback;
  }, []);

  return (new IconLayer({
    id: 'vehicle-icon-layer',
    data,
    iconAtlas: (angleDir === 270) ? busIconWest : busIconEast,
    iconMapping: ICON_MAPPING,
    pickable: true,
    // calls pop-up function
    onClick: info => displayVehicleInfo(info),
  }));
}
