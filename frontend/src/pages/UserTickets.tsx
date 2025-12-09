import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TicketCard from '../components/TicketCard';
import Loader from '../components/Loader';
import CreateTicketModal from '../components/CreateTicketModal'; // New import
import { useTickets } from '../hooks/useTickets';
import { Link } from 'react-router-dom';

const UserTickets: React.FC = () => {
  const { tickets, loading, fetchUserTickets } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const handleCreateSuccess = () => {
    fetchUserTickets(); // Refresh list
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <Loader />
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Tickets
            </h1>
            <Button 
              variant="primary" 
              className="text-lg px-8 py-3"
              onClick={() => setIsModalOpen(true)}
            >
              + New Ticket
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Link key={ticket.id} to={`/ticket/${ticket.id}`}>
                <TicketCard onClick={()=>{}} ticket={ticket} />
              </Link>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No tickets yet</h3>
              <Button 
                variant="primary" 
                onClick={() => setIsModalOpen(true)}
              >
                Create your first ticket
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default UserTickets;
