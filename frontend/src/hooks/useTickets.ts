import { useState, useEffect } from 'react';
import { ticketsAPI, analyticsAPI } from '../api';
import { Ticket } from '../types';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const { data } = await ticketsAPI.getUserTickets();
      setTickets(data);
      console.log({ticketsare:data});
      
    } catch (error) {
      console.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const { data } = await ticketsAPI.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await analyticsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  return {
    tickets,
    loading,
    stats,
    fetchUserTickets,
    fetchAllTickets,
    fetchStats,
  };
};
