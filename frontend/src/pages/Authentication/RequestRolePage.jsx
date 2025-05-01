import React, { useState } from 'react';
import PrimaryButton from '../../components/common/PrimaryButton';
import { requestRole } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RequestRolePage = () => {
  const [requestedRole, setRequestedRole] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!requestedRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      setLoading(true);
      await requestRole(requestedRole, attachment);
      toast.success(`Role request for "${requestedRole}" submitted successfully!`);
      navigate('/login'); // or dashboard if needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit role request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-4">Request a Role</h2>

      <div className="mb-3 text-start">
        <label className="form-label">Select your desired role</label>
        <select
          className="form-select"
          value={requestedRole}
          onChange={(e) => setRequestedRole(e.target.value)}
        >
          <option value="">Select a role</option>
          <option value="Organizer">Organizer</option>
          <option value="Campus Admin">Campus Admin</option>
          <option value="Visitor">Visitor</option>
        </select>
      </div>

      <div className="mb-3 text-start">
        <label className="form-label">Optional Attachment (PDF, Image, etc.)</label>
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </div>

      <PrimaryButton
        text="Submit Request"
        onClick={handleSubmit}
        isLoading={loading}
      />
    </>
  );
};

export default RequestRolePage;