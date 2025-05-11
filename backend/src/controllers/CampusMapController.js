// src/controllers/CampusMapController.js
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import MapCoordinate from '../models/MapCoordinate.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';

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
