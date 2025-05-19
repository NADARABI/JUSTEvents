import React from 'react';
import { InfoWindow } from '@react-google-maps/api';

const MarkerInfoWindow = ({ marker, onClose, onNavigate }) => {
  const handleViewDetails = () => {
    alert(`Details for ${marker.name} will appear here.`);
  };

  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={onClose}
    >
      <div className="info-window">
        <h4>{marker.name}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
          <button onClick={onNavigate}>Navigate Here</button>
          <button onClick={handleViewDetails}>View Details</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </InfoWindow>
  );
};

export default MarkerInfoWindow;
