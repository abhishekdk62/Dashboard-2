import React from 'react';
import { Ticket } from '../types';
import StatusBadge from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl rounded-2xl p-6 border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={ticket.status} />
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {ticket.priority.toUpperCase()}
          </span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {ticket.category}
          </span>
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {ticket.title}
        </h3>
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4">{ticket.description}</p>
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
      <span>Last updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
    </div>
  </div>
);

export default TicketCard;
