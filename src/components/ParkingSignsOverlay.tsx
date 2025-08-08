import React, { useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

interface ParkingSignsOverlayProps {
  map: Map | null;
}

export default function ParkingSignsOverlay({ map }: ParkingSignsOverlayProps) {
  useEffect(() => {
    if (!map) return;

    const url =
      'https://donnees.montreal.ca/dataset/8ac6dd33-b0d3-4eab-a334-5a6283eb7940/resource/52cecff0-2644-4258-a2d1-0c4b3b116117/download/signalisation_stationnement.geojson';

    fetch(url)
      .then((res) => res.json())
      .then((geojson) => {
        const features = geojson.features.slice(0, 5);
        const subset = { type: 'FeatureCollection', features };

        if (map.getSource('parking-signs')) {
          (map.getSource('parking-signs') as mapboxgl.GeoJSONSource).setData(subset);
        } else {
          map.addSource('parking-signs', {
            type: 'geojson',
            data: subset,
          });

          map.addLayer({
            id: 'parking-signs-layer',
            type: 'circle',
            source: 'parking-signs',
            paint: {
              'circle-radius': 6,
              'circle-color': '#007cbf',
            },
          });

          map.on('click', 'parking-signs-layer', (e) => {
            const coordinates = (e.features![0].geometry as any).coordinates.slice();
            const description = e.features![0].properties?.DESCRIPTION_RPA || 'Parking sign';

            new mapboxgl.Popup()
              .setLngLat(coordinates as [number, number])
              .setText(description)
              .addTo(map);
          });

          map.on('mouseenter', 'parking-signs-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'parking-signs-layer', () => {
            map.getCanvas().style.cursor = '';
          });
        }
      })
      .catch(console.error);
  }, [map]);

  return null;
}
