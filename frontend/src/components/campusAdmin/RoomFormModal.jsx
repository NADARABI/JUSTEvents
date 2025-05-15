import React, { useEffect, useState } from 'react';
import { addRoom, updateRoom } from '../../services/campus/roomService';
import { toast } from 'react-toastify';

const RoomFormModal = ({ open, onClose, onSuccess, existing, buildings }) => {
  const [name, setName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(existing?.name || '');
    setBuildingId(existing?.building_id || '');
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (existing) {
        await updateRoom(existing.id, { name, building_id: buildingId });
        toast.success('Room updated.');
      } else {
        await addRoom({ name, building_id: buildingId });
        toast.success('Room added.');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn"
      >
        <h3 className="text-xl font-semibold text-primary mb-4">
          {existing ? 'Edit Room' : 'Add Room'}
        </h3>

        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="w-full px-4 py-2 border rounded-lg mb-4"
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Building
          </option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-secondary transition"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomFormModal;
