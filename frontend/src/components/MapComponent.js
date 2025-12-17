import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

// Center of the map (Chennai)
const initialCenter = [13.0827, 80.2707];

// Helper component to update the map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function MapComponent({ request }) {
  // ✅ SAFETY CHECK: Only create a marker if the request and its coordinates exist
  const hasValidCoordinates = request && request.lat && request.lng;
  const markerPosition = hasValidCoordinates ? [parseFloat(request.lat), parseFloat(request.lng)] : null;
  const mapCenter = markerPosition || initialCenter;

  return (
    <MapContainer center={mapCenter} zoom={13} style={mapContainerStyle}>
      <ChangeView center={mapCenter} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            <strong>{request.bloodType}</strong> needed at <br /> {request.hospitalName}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapComponent;