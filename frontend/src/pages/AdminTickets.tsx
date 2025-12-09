import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import TicketCard from '../components/TicketCard';
import Button from '../components/Button';
import { useTickets } from '../hooks/useTickets';
import { Link } from 'react-router-dom';

const AdminTickets: React.FC = () => {
  const { tickets, loading, fetchAllTickets } = useTickets();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8"><Loader /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            All Tickets ({tickets.length})
          </h1>
          <Link to="/admin">
            <Button variant="secondary">← Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Link key={ticket.id} to={`/admin/tickets/${ticket.id}`} className="block">
              <TicketCard onClick={()=>{}} ticket={ticket} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
