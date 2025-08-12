"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useMapContext } from "@/lib/mapbox/context"; // assuming your provider exposes this

export default function ParkingSignsLayer() {
  const { map } = useMapContext(); // get actual mapbox-gl Map instance

  useEffect(() => {
    if (!map) return;

    const fetchSigns = async () => {
      try {
        const resourceId = "7f1d4ae9-1a12-46d7-953e-6b9c18c78680";
        const url = `https://www.donneesquebec.ca/recherche/api/3/action/datastore_search?resource_id=${resourceId}&limit=50`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.result.records) {
          json.result.records
            .filter(r => r.point_geo && r.point_geo.includes(","))
            .forEach(r => {
              const [lat, lon] = r.point_geo.split(",").map(v => parseFloat(v.trim()));
              
              // Create marker
              const el = document.createElement("div");
              el.innerHTML = "🚫";
              el.style.fontSize = "20px";
              el.style.cursor = "pointer";

              const marker = new mapboxgl.Marker(el)
                .setLngLat([lon, lat])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <h4>${r.sous_type || r.type || "Restriction inconnue"}</h4>
                    <p>${r.description || ""}</p>
                  `)
                )
                .addTo(map);
            });
        }
      } catch (err) {
        console.error("Error fetching signs:", err);
      }
    };

    fetchSigns();
  }, [map]);

  return null; // no JSX needed, we’re drawing directly on the
