'use client';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

const locations = [
  { id: 1, name: 'Montreal', latitude: 45.5017, longitude: -73.5673 },
  { id: 2, name: 'Toronto', latitude: 43.65107, longitude: -79.347015 }
];

const MapComponent = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Map
      initialViewState={{
        longitude: -73.5673,
        latitude: 45.5017,
        zoom: 5
      }}
      style={{ width: '100%', height: '80vh', borderRadius: '1rem' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {locations.map((loc) => (
        <Marker key={loc.id} longitude={loc.longitude} latitude={loc.latitude}>
          <div
            className="bg-blue-500 w-4 h-4 rounded-full cursor-pointer"
            onClick={() => setSelected(loc.id)}
          />
          {selected === loc.id && (
            <Popup
              longitude={loc.longitude}
              latitude={loc.latitude}
              closeOnClick={false}
              onClose={() => setSelected(null)}
            >
              <div>{loc.name}</div>
            </Popup>
          )}
        </Marker>
      ))}
    </Map>
  );
};

export default MapComponent;
