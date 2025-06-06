import React from 'react';
import './BuildingDetailsModal.css';

const BuildingDetailsModal = ({ building, onClose }) => {
  if (!building) return null;

  const { name, location, lat, lng } = building;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{name}</h2>
        <p><strong>Location:</strong> {location || 'Not specified'}</p>
        <p><strong>Latitude:</strong> {lat}</p>
        <p><strong>Longitude:</strong> {lng}</p>
        {/* add more like images, opening hours, QR here */}
      </div>
    </div>
  );
};

export default BuildingDetailsModal;
