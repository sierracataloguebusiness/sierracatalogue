import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingBag, FaHeart, FaUser } from "react-icons/fa";
import Loader from "../../../component/Loader.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api/customer";

const CustomerDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/userDashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg border border-gray-800 mb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName || "Shopper"} 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Here’s a quick overview of your Sierra Catalogue activity.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FaShoppingBag />}
          label="Pending Orders"
          value={stats?.orders || 0}
        />
        <StatCard
          icon={<FaHeart />}
          label="Favorites"
          value={stats?.saved || 0}
        />
        <StatCard icon={<FaUser />} label="Account" value="Active" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center border border-gray-700 hover:border-yellow-500 transition">
    <div className="text-yellow-400 text-2xl mb-2">{icon}</div>
    <p className="text-lg font-semibold">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

export default CustomerDashboard;
