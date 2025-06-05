// src/components/CampusMap/MarkerInfoWindow.jsx
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';

const MarkerInfoWindow = ({ marker, onClose, onNavigate }) => {
  const handleViewDetails = () => {
    alert(`More details for "${marker.name}" will be shown here.`);
    // TODO: Replace with real modal or routing later
  };

  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={onClose}
    >
      <div className="info-window">
        <h4>{marker.name}</h4>
        <div className="info-buttons">
          <button onClick={onNavigate}>Navigate Here</button>
          <button onClick={handleViewDetails}>View Details</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </InfoWindow>
  );
};

export default MarkerInfoWindow;
