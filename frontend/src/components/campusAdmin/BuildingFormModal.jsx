import React, { useEffect, useState } from 'react';
import { addBuilding, updateBuilding } from '../../services/campus/buildingService';
import { toast } from 'react-toastify';

const BuildingFormModal = ({ open, onClose, onSuccess, existing }) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(existing?.name || '');
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (existing) {
        await updateBuilding(existing.id, { name });
        toast.success('Building updated.');
      } else {
        await addBuilding({ name });
        toast.success('Building added.');
      }
      onSuccess();
      onClose();
    } catch (error) {
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
          {existing ? 'Edit Building' : 'Add Building'}
        </h3>

        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Building Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

export default BuildingFormModal;
