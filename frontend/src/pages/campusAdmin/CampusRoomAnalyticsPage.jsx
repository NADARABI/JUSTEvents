import React, { useEffect, useState } from 'react';
import {
  getTotalBookings,
  getMostUsedRooms,
  getBookingTrends,
  getBookingsByBuilding,
  getBookingCancelRate,
} from '../../services/campus/analyticsService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard } from '../../components/campusAdmin/StatCard';
import { toast } from 'react-toastify';

const COLORS = ['#062743', '#113A5D', '#4F959D', '#98D2C0', '#ccc'];

const CampusRoomAnalyticsPage = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [cancelRate, setCancelRate] = useState(null);
  const [mostUsedRooms, setMostUsedRooms] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [byBuilding, setByBuilding] = useState([]);

  const fetchAll = async () => {
    try {
      const [
        total,
        cancel,
        mostUsed,
        trends,
        buildings,
      ] = await Promise.all([
        getTotalBookings(),
        getBookingCancelRate(),
        getMostUsedRooms(),
        getBookingTrends(),
        getBookingsByBuilding(),
      ]);

      setTotalBookings(total.count);
      setCancelRate(cancel.cancel_rate);
      setMostUsedRooms(mostUsed);
      setBookingTrends(trends);
      setByBuilding(buildings);
    } catch (err) {
      toast.error('Failed to load analytics data.');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold text-primary mb-6">Room Booking Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Cancel Rate" value={cancelRate} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-secondary mb-2">Most Used Rooms</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mostUsedRooms}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#113A5D" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-secondary mb-2">Booking Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingTrends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#4F959D" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-secondary mb-2">Bookings by Building</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={byBuilding}
              dataKey="bookings"
              nameKey="building"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {byBuilding.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CampusRoomAnalyticsPage;
