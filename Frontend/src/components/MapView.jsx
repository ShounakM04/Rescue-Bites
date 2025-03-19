import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ latitude, longitude, foodName }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]}>
        <Popup>{foodName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
