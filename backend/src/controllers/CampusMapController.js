// src/controllers/CampusMapController.js
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import MapCoordinate from '../models/MapCoordinate.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get All Buildings with Coordinates
 */
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll();
    sendResponse(res, 200, 'Buildings fetched successfully', buildings);
  } catch (error) {
    console.error('getAllBuildings:', error.message);
    sendResponse(res, 500, 'Server error while fetching buildings');
  }
};

/**
 * Get All Rooms by Building ID
 */
export const getRoomsByBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.findAll();
    const filteredRooms = rooms.filter(room => room.building_id == id);
    sendResponse(res, 200, 'Rooms fetched successfully', filteredRooms);
  } catch (error) {
    console.error('getRoomsByBuilding:', error.message);
    sendResponse(res, 500, 'Server error while fetching rooms');
  }
};

/**
 * Get All Map Markers for Google Maps
 */
export const getMapMarkers = async (req, res) => {
  try {
    const coordinates = await MapCoordinate.findAll();
    const markers = coordinates.map(coord => ({
      id: coord.id,
      building_id: coord.building_id,
      x: coord.x,
      y: coord.y,
      level: coord.level,
    }));
    sendResponse(res, 200, 'Map markers fetched successfully', markers);
  } catch (error) {
    console.error('getMapMarkers:', error.message);
    sendResponse(res, 500, 'Server error while fetching map markers');
  }
};

/**
 * Get Event Location on Map
 */
export const getEventLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, 'Event not found');

    const room = await Room.findById(event.venue_id);
    if (!room) return sendResponse(res, 404, 'Venue not found');

    const building = await Building.findById(room.building_id);
    if (!building) return sendResponse(res, 404, 'Building not found');

    sendResponse(res, 200, 'Event location fetched successfully', {
      event,
      room,
      building,
    });
  } catch (error) {
    console.error('getEventLocation:', error.message);
    sendResponse(res, 500, 'Server error while fetching event location');
  }
};

/**
 *  Get Real-Time Navigation Path
 */
export const getNavigationPath = async (req, res) => {
  try {
    const { startId, endId, type } = req.query;

    // Validate Parameters
    if (!startId || !endId || !type) {
      return sendResponse(res, 400, 'Missing required parameters: startId, endId, type');
    }

    // Fetch Coordinates for Start and End Locations
    let startCoordinates, endCoordinates;

    if (type === 'building') {
      const startBuilding = await Building.findById(startId);
      const endBuilding = await Building.findById(endId);

      console.log(" [DB] Start Building:", startBuilding);
      console.log(" [DB] End Building:", endBuilding);

      if (!startBuilding || !endBuilding) {
        return sendResponse(res, 404, 'One or both buildings not found');
      }

      
      startCoordinates = startBuilding.map_coordinates;
      endCoordinates = endBuilding.map_coordinates;
      
    } else if (type === 'room') {
      const startRoom = await Room.findById(startId);
      const endRoom = await Room.findById(endId);

      console.log(" [DB] Start Room:", startRoom);
      console.log(" [DB] End Room:", endRoom);

      if (!startRoom || !endRoom) {
        return sendResponse(res, 404, 'One or both rooms not found');
      }

     
      startCoordinates = startRoom.map_coordinates;
      endCoordinates = endRoom.map_coordinates;
    } else {
      return sendResponse(res, 400, 'Invalid type parameter. Must be "building" or "room".');
    }

    // Validation Check: Make sure coordinates are valid
    console.log(" [Parsed] Start Coordinates:", startCoordinates);
    console.log(" [Parsed] End Coordinates:", endCoordinates);

    if (!startCoordinates.x || !startCoordinates.y || !endCoordinates.x || !endCoordinates.y) {
      console.error(" Missing x or y values");
      return sendResponse(res, 400, 'Coordinates not properly set for one or both locations');
    }

    // convert to string format
    const startLocation = `${startCoordinates.x},${startCoordinates.y}`;
    const endLocation = `${endCoordinates.x},${endCoordinates.y}`;

    console.log(" [Formatted] Start Location:", startLocation);
    console.log(" [Formatted] End Location:", endLocation);

    //  Call Google Maps API for Directions
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${endLocation}&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log(` Calling Google Maps API: ${url}`);

    const response = await axios.get(url);
    const directions = response.data;

    console.log(" Directions Response:", directions);

    if (directions.status !== "OK") {
      return sendResponse(res, 500, 'Failed to fetch directions from Google Maps API', directions);
    }

    // Respond with the path details
    sendResponse(res, 200, 'Path fetched successfully', directions.routes[0]);

  } catch (error) {
    console.error('getNavigationPath:', error.message);
    sendResponse(res, 500, 'Server error while fetching navigation path');
  }
};