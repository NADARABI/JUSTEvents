import React, { useEffect, useState } from 'react';
import {
  getRooms,
  deleteRoom,
  getBuildings,
} from '../../services/campus/roomService';
import RoomFormModal from '../../components/campusAdmin/RoomFormModal';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

const CampusRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const [roomData, buildingData] = await Promise.all([
        getRooms(),
        getBuildings(),
      ]);
      setRooms(roomData);
      setBuildings(buildingData);
    } catch (err) {
      toast.error('Failed to fetch room data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAdd = () => {
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(id);
        toast.success('Room deleted successfully.');
        fetchRooms();
      } catch (err) {
        toast.error('Failed to delete room.');
      }
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Manage Rooms</h2>
        <button
          onClick={handleAdd}
          className="bg-accent hover:bg-highlight transition text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <PlusCircle size={20} /> Add Room
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4 border">
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
                    <button
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <RoomFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchRooms}
        existing={selectedRoom}
        buildings={buildings}
      />
    </section>
  );
};

export default CampusRoomsPage;
