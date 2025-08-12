"use client";

import { useEffect, useState } from "react";
import { useMap, Marker, Popup } from "react-map-gl";

export default function ParkingSignsLayer() {
  const { current: map } = useMap(); // Access the current map instance
  const [signs, setSigns] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const resourceId = "7f1d4ae9-1a12-46d7-953e-6b9c18c78680";
        const url = `https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?resource_id=${resourceId}&limit=50`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.result.records) {
          const data = json.result.records
            .filter(r => r.point_geo && r.point_geo.includes(","))
            .map(r => {
              const [lat, lon] = r.point_geo
                .split(",")
                .map(v => parseFloat(v.trim()));
              return {
                id: r._id,
                lat,
                lon,
                restriction: r.sous_type || r.type || "Restriction inconnue",
                details: r.description || "",
              };
            });

          setSigns(data);
        }
      } catch (err) {
        console.error("Error fetching signs:", err);
      }
    };

    fetchSigns();
  }, []);

  if (!map) return null; // No map yet

  return (
    <>
      {signs.map(sign => (
        <Marker
          key={sign.id}
          longitude={sign.lon}
          latitude={sign.lat}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelected(sign);
          }}
        >
          <div style={{ fontSize: "20px", cursor: "pointer" }}>🚫</div>
        </Marker>
      ))}

      {selected && (
        <Popup
          longitude={selected.lon}
          latitude={selected.lat}
          onClose={() => setSelected(null)}
          anchor="top"
        >
          <div>
            <h4>{selected.restriction}</h4>
            <p>{selected.details}</p>
          </div>
        </Popup>
      )}
    </>
  );
}
