import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";

const Map = () => {
  // Initialize position with a default value
  const [position, setPosition] = useState<LatLngExpression | null>([
    51.505, -0.09,
  ]);

  // Function to update position
  const showPosition = (pos: GeolocationPosition) => {
    if (pos?.coords?.latitude && pos?.coords?.longitude) {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    }
  };

  // Get user's geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }, []);

  return (
    <div style={{ height: "50vh", width: "50%" }}>
      <MapContainer
        center={position as LatLngExpression} // Ensure position is valid
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && (
          <Marker position={position}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
