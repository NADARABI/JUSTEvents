// src/components/CampusMap/MapSidebar.jsx
import React, { useState } from 'react';
import './MapSidebar.css';

const MapSidebar = ({ buildings, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.building-item');
    items.forEach((item) => {
      const match = item.innerText.toLowerCase().includes(query);
      item.style.display = match ? 'flex' : 'none';
    });
  };

  const handleClick = (building) => {
    setSelectedId(building.id);
    onSelect(building);
  };

  const sortedBuildings = [...buildings].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="map-sidebar">
      <h3>Campus Buildings</h3>
      <input
        type="text"
        className="map-search"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <ul className="building-list">
        {sortedBuildings.map((b) => (
          <li
            key={b.id}
            className={`building-item ${selectedId === b.id ? 'active' : ''}`}
            onClick={() => handleClick(b)}
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
