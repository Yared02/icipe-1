"use client";

import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export const GoogleMap = ({
  latLng,
  setLatLng,
}: {
  latLng?: {
    lat: number;
    lng: number;
  };
  setLatLng: (latLng: { lat: number; lng: number }) => void;
}) => {
  return (
    <APIProvider apiKey={process.env.NEXT_GOOGLE_MAPS_API_KEY ?? ""}>
      <Map
        defaultZoom={3}
        className="h-[400px] rounded-md shadow-md"
        defaultCenter={{ lat: 9.0130707, lng: 38.6657964 }}
        onDblclick={(e) => {
          if (e.detail.latLng?.lat && e.detail.latLng)
            setLatLng({ lat: e.detail.latLng?.lat, lng: e.detail.latLng.lng });
        }}
      >
        <Marker
          draggable
          position={
            latLng
              ? { lat: latLng.lat, lng: latLng.lng }
              : { lat: 9.0130707, lng: 38.6657964 }
          }
          onDragEnd={(e) => {
            if (e.latLng?.lat && e.latLng) {
              setLatLng({ lat: e.latLng?.lat(), lng: e.latLng.lng() });
            }
          }}
        />
      </Map>
    </APIProvider>
  );
};
