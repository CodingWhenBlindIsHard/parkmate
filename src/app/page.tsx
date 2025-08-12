"use client";

import { useRef } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapCotrols from "@/components/map/map-controls";
import MapSearch from "@/components/map/map-search";
import ParkingSignsLayer from "../components/ParkingSignsLayer";

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-screen h-screen">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full"
      />

      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude: -73.569916,
          latitude: 45.496082,
          zoom: 10,
        }}
      >
        <MapSearch />
        <MapCotrols />
        <MapStyles />

        {/* 🚫 Parking signs layer */}
        <ParkingSignsLayer />
      </MapProvider>
    </div>
  );
}
