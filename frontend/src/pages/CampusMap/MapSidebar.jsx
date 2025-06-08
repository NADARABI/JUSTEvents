import React, { useState } from 'react';
import './MapSidebar.css';

const MapSidebar = ({ buildings, onSelect, selectedId, rooms = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleClick = (building) => onSelect(building);

  const sortedBuildings = [...buildings].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredBuildings = sortedBuildings.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBuilding = buildings.find(b => b.id === selectedId);

  return (
    <div className="map-sidebar">
      <h3>
        Campus Buildings
        <span className="building-count"> ({filteredBuildings.length})</span>
      </h3>

      <input
        type="text"
        className="map-search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
      />

      <ul className="building-list">
        {filteredBuildings.map((b) => (
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

      {filteredBuildings.length === 0 && (
        <div className="no-results">No buildings found.</div>
      )}

      {selectedBuilding && (
        <div className="room-section">
          <h4>Rooms in {selectedBuilding.name}</h4>
          {rooms.length > 0 ? (
            <ul className="room-list">
              {rooms.map((room) => (
                <li key={room.id} className="room-item">
                  <strong>{room.name}</strong> – {room.type} ({room.capacity} ppl)
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-rooms">No rooms mapped for this building.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
