import React, { useEffect, useState } from 'react';
import { getBuildings, deleteBuilding } from '../../services/campus/buildingService';
import BuildingFormModal from '../../components/campusAdmin/BuildingFormModal';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

const CampusBuildingsPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch (error) {
      toast.error('Failed to load buildings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleAdd = () => {
    setSelectedBuilding(null);
    setModalOpen(true);
  };

  const handleEdit = (building) => {
    setSelectedBuilding(building);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        await deleteBuilding(id);
        toast.success('Building deleted successfully.');
        fetchBuildings();
      } catch (error) {
        toast.error('Could not delete building.');
      }
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Manage Buildings</h2>
        <button
          onClick={handleAdd}
          className="bg-accent hover:bg-highlight transition text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <PlusCircle size={20} /> Add Building
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
                <th className="px-2">Building Name</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building, index) => (
                <tr key={building.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="px-2">{building.name}</td>
                  <td className="px-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(building)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(building.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {buildings.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">
                    No buildings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <BuildingFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBuildings}
        existing={selectedBuilding}
      />
    </section>
  );
};

export default CampusBuildingsPage;
