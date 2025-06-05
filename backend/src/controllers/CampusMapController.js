// src/controllers/CampusMapController.js
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Get all buildings with their coordinates
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
 * Get all rooms for a specific building
 */
export const getRoomsByBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.findAll();

    // Filter by building
    let filtered = rooms.filter(r => r.building_id == id);

    // Get user role from token (if any)
    const role = req.user?.role || 'Visitor';

    // Only Admins and Organizers can see unavailable rooms
    if (!['System Admin', 'Campus Admin', 'Organizer'].includes(role)) {
      filtered = filtered.filter(r => r.status === 'Available');
    }

    sendResponse(res, 200, 'Rooms fetched successfully', filtered);
  } catch (error) {
    console.error('getRoomsByBuilding:', error.message);
    sendResponse(res, 500, 'Server error while fetching rooms');
  }
};

/**
 * Get event location (building + room)
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

    sendResponse(res, 200, 'Event location fetched successfully', { event, room, building });
  } catch (error) {
    console.error('getEventLocation:', error.message);
    sendResponse(res, 500, 'Server error while fetching event location');
  }
};

/**
 * Get navigation path from start → end using Google Maps API
 * Query params:
 * - origin (lat,lng string) OR startId
 * - endId
 * - type: "room" or "building"
 */
export const getNavigationPath = async (req, res) => {
  try {
    const { origin, startId, endId, type } = req.query;

    if (!endId || !type) {
      return sendResponse(res, 400, 'Missing required parameters: endId and type');
    }

    let startCoordinates, endCoordinates;

    // 1. Get End Coordinates
    if (type === 'building') {
      const end = await Building.findById(endId);
      if (!end) return sendResponse(res, 404, 'Building not found');
      endCoordinates = { lat: parseFloat(end.latitude), lng: parseFloat(end.longitude) };
    } else if (type === 'room') {
      const end = await Room.findById(endId);
      if (!end) return sendResponse(res, 404, 'Room not found');
      endCoordinates = { lat: parseFloat(end.latitude), lng: parseFloat(end.longitude) };
    } else {
      return sendResponse(res, 400, 'Invalid type parameter. Must be "building" or "room".');
    }

    // 2. Determine Start Coordinates
    if (origin) {
      const [lat, lng] = origin.split(',').map(Number);
      startCoordinates = { lat, lng };
    } else if (startId) {
      const start =
        type === 'building'
          ? await Building.findById(startId)
          : await Room.findById(startId);
      if (!start) return sendResponse(res, 404, 'Start location not found');
      startCoordinates = { lat: parseFloat(start.latitude), lng: parseFloat(start.longitude) };
    } else {
      return sendResponse(res, 400, 'Either origin or startId must be provided');
    }

    // 3. Validate Coordinates
    const isValidCoord = (coord) =>
      coord &&
      typeof coord.lat === 'number' &&
      typeof coord.lng === 'number' &&
      coord.lat >= -90 && coord.lat <= 90 &&
      coord.lng >= -180 && coord.lng <= 180;

    if (!isValidCoord(startCoordinates) || !isValidCoord(endCoordinates)) {
      return sendResponse(res, 400, 'Invalid or missing coordinates');
    }

    // 4. Call Google Maps Directions API
    const originStr = `${startCoordinates.lat},${startCoordinates.lng}`;
    const destinationStr = `${endCoordinates.lat},${endCoordinates.lng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    const directions = response.data;

    if (directions.status !== 'OK') {
      return sendResponse(res, 500, 'Google Maps API failed', directions);
    }

    sendResponse(res, 200, 'Path fetched successfully', directions.routes[0]);
  } catch (error) {
    console.error('getNavigationPath:', error.message);
    sendResponse(res, 500, 'Server error while fetching navigation path');
  }
};
