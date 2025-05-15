import React, { useEffect, useState } from 'react';
import { getPendingBookings, reviewBooking } from '../../services/campus/bookingService';
import { toast } from 'react-toastify';

const CampusBookingRequestsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getPendingBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`)) return;
    try {
      await reviewBooking(id, status);
      toast.success(`Booking ${status.toLowerCase()} successfully.`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Pending Room Bookings</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4 border">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-3 px-2">#</th>
                <th className="px-2">Room</th>
                <th className="px-2">User</th>
                <th className="px-2">Start Time</th>
                <th className="px-2">End Time</th>
                <th className="px-2">Purpose</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={b.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-2">{idx + 1}</td>
                  <td className="px-2">{b.room_name || 'Unknown'}</td>
                  <td className="px-2">{b.user_name}</td>
                  <td className="px-2">{new Date(b.start_time).toLocaleString()}</td>
                  <td className="px-2">{new Date(b.end_time).toLocaleString()}</td>
                  <td className="px-2">{b.purpose}</td>
                  <td className="px-2 flex gap-2">
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleReview(b.id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleReview(b.id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-4">
                    No pending bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default CampusBookingRequestsPage;
