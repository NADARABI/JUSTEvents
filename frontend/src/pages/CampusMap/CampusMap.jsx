import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { decode } from '@googlemaps/polyline-codec';
import axios from 'axios';
import './CampusMap.css';
import MarkerInfoWindow from './MarkerInfoWindow';
import MapSidebar from './MapSidebar'; 

const mapContainerStyle = { height: '80vh', width: '100%' };
const center = { lat: 32.496, lng: 35.991 };
const polylineOptions = {
  strokeColor: '#4CAF50',
  strokeOpacity: 0.9,
  strokeWeight: 5,
  geodesic: true,
  zIndex: 10
};
const MAP_LIBRARIES = ['marker'];
const MAP_ID = process.env.REACT_APP_MAP_ID;

function createLabel(text, bgColor) {
  const div = document.createElement('div');
  div.style.background = bgColor;
  div.style.color = 'white';
  div.style.padding = '4px 8px';
  div.style.borderRadius = '50%';
  div.style.fontSize = '14px';
  div.style.fontWeight = 'bold';
  div.style.textAlign = 'center';
  div.style.width = '24px';
  div.style.height = '24px';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.innerText = text;
  return div;
}

const CampusMap = () => {
  const [markers, setMarkers] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const markerElementsRef = useRef([]);
  const routeStartRef = useRef(null);
  const routeEndRef = useRef(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/campus-map/markers');
        if (res.data.success) {
          const formatted = res.data.data.map(m => ({
            id: m.building_id,
            name: m.name || `Building ${m.building_id}`,
            lat: m.x,
            lng: m.y
          }));
          console.log('Markers Fetched:', formatted);
          setMarkers(formatted);
        }
      } catch (err) {
        console.error('Error fetching markers:', err.message);
      }
    };
    fetchMarkers();
  }, []);

  useEffect(() => {
    if (!mapInstance || markers.length === 0) return;

    const loadMarkers = () => {
      if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
        console.log('Waiting for AdvancedMarkerElement...');
        return false;
      }

      markerElementsRef.current.forEach(m => m.map = null);
      markerElementsRef.current = [];

      markers.forEach(marker => {
        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat: marker.lat, lng: marker.lng },
          title: marker.name
        });

        advancedMarker.addListener('gmp-click', () => {
          console.log('Marker clicked:', marker.name);
          setSelectedMarker(marker);
          setPathCoordinates([]);
          clearRouteMarkers();
        });

        markerElementsRef.current.push(advancedMarker);
      });

      return true;
    };

    const interval = setInterval(() => {
      if (loadMarkers()) clearInterval(interval);
    }, 500);
  }, [mapInstance, markers]);

  const clearRouteMarkers = () => {
    if (routeStartRef.current) routeStartRef.current.map = null;
    if (routeEndRef.current) routeEndRef.current.map = null;
    routeStartRef.current = null;
    routeEndRef.current = null;
  };

  const handleNavigate = async () => {
    if (!selectedMarker) return;

    console.log('Navigating to:', selectedMarker.name);

    if (!navigator.geolocation) {
      alert('Your browser does not support geolocation.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        try {
          const res = await axios.get(
            `http://localhost:5000/api/campus-map/navigate?origin=${userLat},${userLng}&endId=${selectedMarker.id}&type=building`
          );

          const encodedPolyline = res.data.data.overview_polyline.points;
          const decodedPath = decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
          console.log('Decoded Path:', decodedPath);
          setPathCoordinates(decodedPath);

          const leg = res.data.data.legs[0];

          routeStartRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: leg.start_location,
            title: 'You',
            content: createLabel('A', '#4CAF50')
          });

          routeEndRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: leg.end_location,
            title: selectedMarker.name,
            content: createLabel('B', '#FF5252')
          });

          const bounds = new window.google.maps.LatLngBounds();
          decodedPath.forEach(coord => bounds.extend(coord));
          mapInstance?.fitBounds(bounds);
        } catch (err) {
          console.error('Navigation error:', err.message);
          alert('Failed to fetch route. Please try again.');
        }
      },
      (error) => {
        console.error('Location access denied:', error.message);
        alert('Please allow location access to use navigation.');
      }
    );
  };

  const handleSidebarSelect = (marker) => {
    setSelectedMarker(marker);
    setPathCoordinates([]);
    clearRouteMarkers();
    if (mapInstance) {
      mapInstance.panTo({ lat: marker.lat, lng: marker.lng });
      mapInstance.setZoom(18);
    }
  };

  const handleClose = () => {
    console.log('InfoWindow closed');
    setSelectedMarker(null);
    setPathCoordinates([]);
    clearRouteMarkers();
  };

  return (
    <div style={{ display: 'flex' }}>
      <MapSidebar buildings={markers} onSelect={handleSidebarSelect} />

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={MAP_LIBRARIES}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={17}
          options={{ mapId: MAP_ID }}
          onLoad={map => {
            console.log('Map Loaded');
            setMapInstance(map);
          }}
        >
          {pathCoordinates.length > 0 && (
            <Polyline path={pathCoordinates} options={polylineOptions} />
          )}

          {selectedMarker && mapInstance && (
            <MarkerInfoWindow
              marker={selectedMarker}
              onClose={handleClose}
              onNavigate={handleNavigate}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CampusMap;
