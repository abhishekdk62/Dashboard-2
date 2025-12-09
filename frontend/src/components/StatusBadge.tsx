import React from 'react';

interface StatusBadgeProps {
  status?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, className = '' }) => {
  // ✅ PRIORITY FIRST (if provided)
  if (priority) {
    const priorityConfig = {
      low: { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      high: { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${config.color} ${className}`}>
        {config.label}
      </span>
    );
  }

  // ✅ STATUS (existing logic)
  if (status) {
    const statusConfig = {
      open: { label: 'Open', color: 'bg-green-100 text-green-800 border-green-200' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      resolved: { label: 'Resolved', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.closed;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${config.color} ${className}`}>
        {config.label}
      </span>
    );
  }

  return null;
};

export default StatusBadge;
