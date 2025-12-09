import React from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

const AdminDashboard: React.FC = () => {
  const { tickets, loading, fetchAllTickets } = useTickets();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Box 1: View & Manage Tickets */}
          <Link 
            to="/admin/tickets"
            className="block p-12 border-2 border-gray-200 rounded-2xl bg-white hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200 text-center"
          >
            <div className="text-5xl font-bold mb-6">📋</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">View & Manage Tickets</div>
          </Link>

          {/* Box 2: Complete Dashboard */}
          <Link 
            to="/admin/analytics"
            className="block p-12 border-2 border-gray-200 rounded-2xl bg-white hover:bg-gray-50 hover:border-emerald-300 transition-colors duration-200 text-center"
          >
            <div className="text-5xl font-bold mb-6">📊</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">Complete Dashboard</div>
            <div className="text-lg text-gray-600">Analytics & trends</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
