import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Loader from './Loader';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { useTickets } from '../hooks/useTickets';
import { Ticket } from '../types';

const AdminAnalytics: React.FC = () => {
  const { tickets, loading, fetchAllTickets } = useTickets();
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    category: '',
    sort: 'createdAt_desc',
    search: ''
  });

  useEffect(() => {
    fetchAllTickets();
  }, []);

  // Filtered & sorted tickets
  const filteredTickets = useMemo(() => {
    let result = tickets;

    // Status filter
    if (filter.status) result = result.filter(t => t.status === filter.status);
    
    // Priority filter
    if (filter.priority) result = result.filter(t => t.priority === filter.priority);
    
    // Category filter
    if (filter.category) result = result.filter(t => t.category === filter.category);
    
    // Search
    if (filter.search) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.User?.name?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filter.sort === 'createdAt_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (filter.sort === 'createdAt_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [tickets, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Complete Dashboard
            </h1>
            <p className="text-xl text-gray-600 mt-1">All tickets with advanced filtering</p>
          </div>
          <Link to="/admin">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select 
                value={filter.priority}
                onChange={(e) => setFilter({...filter, priority: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="support">Support</option>
                <option value="feature">Feature</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
              <select 
                value={filter.sort}
                onChange={(e) => setFilter({...filter, sort: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by title or user name..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button 
              onClick={() => setFilter({status:'', priority:'', category:'', sort:'createdAt_desc', search:''})}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">{ticket.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.User?.name || ticket.User?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 capitalize">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Results count */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold">{filteredTickets.length}</span> of <span className="font-semibold">{tickets.length}</span> tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
