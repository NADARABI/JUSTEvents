// src/components/CampusMap/MapSidebar.jsx
import React from 'react';
import './MapSidebar.css';

const MapSidebar = ({ buildings, onSelect }) => {
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.building-item');
    items.forEach((item) => {
      const match = item.innerText.toLowerCase().includes(query);
      item.style.display = match ? 'flex' : 'none';
    });
  };

  return (
    <div className="map-sidebar">
      <h3> Campus Buildings</h3>
      <input
        type="text"
        className="map-search"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <ul className="building-list">
        {buildings.map((b) => (
          <li
            key={b.id}
            className="building-item"
            onClick={() => onSelect(b)}
            title={`Go to ${b.name}`}
          >
            {b.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapSidebar;
