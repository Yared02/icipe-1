"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import trees from "./trees";

export function DashboardCluster() {
  return (
    <APIProvider apiKey={process.env.NEXT_GOOGLE_MAPS_API_KEY ?? ""}>
      <Map
        mapId={"bf51a910020fa25a"}
        className="h-[400px]"
        defaultCenter={{ lat: 9.03, lng: 38.74 }}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        <Markers points={trees} />
      </Map>
    </APIProvider>
  );
}

type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <span className="tree">👨🏾‍🌾</span>
        </AdvancedMarker>
      ))}
    </>
  );
};
