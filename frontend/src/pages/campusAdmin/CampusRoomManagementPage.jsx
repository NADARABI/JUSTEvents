import React, { useEffect, useState } from 'react';
import {
  getRooms,
  deleteRoom
} from '../../services/campus/roomService';
import {
  getBuildings,
  deleteBuilding
} from '../../services/campus/buildingService';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';
import RoomFormModal from '../../components/campusAdmin/RoomFormModal';
import BuildingFormModal from '../../components/campusAdmin/BuildingFormModal';

const CampusRoomManagementPage = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [buildingModalOpen, setBuildingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomData, buildingData] = await Promise.all([
        getRooms(),
        getBuildings(),
      ]);
      setRooms(roomData);
      setBuildings(buildingData);
    } catch (err) {
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Buildings
  const handleBuildingAdd = () => {
    setSelectedBuilding(null);
    setBuildingModalOpen(true);
  };

  const handleBuildingEdit = (building) => {
    setSelectedBuilding(building);
    setBuildingModalOpen(true);
  };

  const handleBuildingDelete = async (id) => {
    if (window.confirm('Delete this building?')) {
      try {
        await deleteBuilding(id);
        toast.success('Building deleted.');
        fetchData();
      } catch {
        toast.error('Failed to delete building.');
      }
    }
  };

  // Handlers for Rooms
  const handleRoomAdd = () => {
    setSelectedRoom(null);
    setRoomModalOpen(true);
  };

  const handleRoomEdit = (room) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  const handleRoomDelete = async (id) => {
    if (window.confirm('Delete this room?')) {
      try {
        await deleteRoom(id);
        toast.success('Room deleted.');
        fetchData();
      } catch {
        toast.error('Failed to delete room.');
      }
    }
  };

  return (
    <section className="space-y-12">
      {/* === Building Management === */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Manage Buildings</h2>
          <button
            onClick={handleBuildingAdd}
            className="bg-accent hover:bg-highlight text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Building
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading...</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-2">#</th>
                  <th className="px-2">Building Name</th>
                  <th className="px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((b, i) => (
                  <tr key={b.id} className="hover:bg-gray-50 border-b">
                    <td className="py-2 px-2">{i + 1}</td>
                    <td className="px-2">{b.name}</td>
                    <td className="px-2 flex gap-2">
                      <button onClick={() => handleBuildingEdit(b)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleBuildingDelete(b.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {buildings.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-400">No buildings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* === Room Management === */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Manage Rooms</h2>
          <button
            onClick={handleRoomAdd}
            className="bg-accent hover:bg-highlight text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Room
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Loading...</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 px-2">#</th>
                  <th className="px-2">Room Name</th>
                  <th className="px-2">Building</th>
                  <th className="px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, index) => (
                  <tr key={room.id} className="hover:bg-gray-50 border-b">
                    <td className="py-2 px-2">{index + 1}</td>
                    <td className="px-2">{room.name}</td>
                    <td className="px-2">{room.building_name}</td>
                    <td className="px-2 flex gap-2">
                      <button onClick={() => handleRoomEdit(room)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleRoomDelete(room.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">No rooms found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* === Modals === */}
      <RoomFormModal
        open={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
        onSuccess={fetchData}
        existing={selectedRoom}
        buildings={buildings}
      />

      <BuildingFormModal
        open={buildingModalOpen}
        onClose={() => setBuildingModalOpen(false)}
        onSuccess={fetchData}
        existing={selectedBuilding}
      />
    </section>
  );
};

export default CampusRoomManagementPage;
