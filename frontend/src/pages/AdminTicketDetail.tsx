import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';
import StatusBadge from '../components/StatusBadge';
import { useFormik } from 'formik';
import { ticketsAPI } from '../api';
import { Ticket, Comment } from '../types';
import { useSocket } from '../hooks/useSocket'; // ✅ SOCKET IMPORT

const AdminTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  // ✅ SOCKET INTEGRATION - LIVE UPDATES
  useSocket(id, {
    onNewComment: useCallback((newComment: Comment) => {
      console.log('🔔 LIVE: New comment received!');
      setComments(prev => [newComment, ...prev]);
    }, []),
    
    onStatusUpdate: useCallback((data: { id: number; status: string }) => {
      console.log('🔔 LIVE: Status updated!', data);
      if (ticket?.id === data.id) {
        setTicket(prev => prev ? { ...prev, status: data.status } as Ticket : prev);
      }
    }, [ticket?.id])
  });

  useEffect(() => {
    if (!id) return;
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await ticketsAPI.getTicketAdmin(Number(id));
      setTicket(data);
      console.log(data);
      
      setComments(data.Comments || []);
    } catch (error) {
      console.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  // Status Update Form
  const statusFormik = useFormik({
    initialValues: { status: '' },
    onSubmit: async (values) => {
      if (!ticket) return;
      try {
        await ticketsAPI.updateStatus(ticket.id, values.status);
        fetchTicket(); // Refresh
      } catch (error) {
        console.error('Failed to update status');
      }
    },
  });

  // Comment Form - FIXED WITH REFRESH
  const commentFormik = useFormik({
    initialValues: { content: '' },
    onSubmit: async (values) => {
      if (!id) return;
      setSubmittingComment(true);
      try {
        await ticketsAPI.addComment(Number(id), values.content);
        commentFormik.resetForm();
        fetchTicket(); // ✅ REFRESH - Shows comment instantly
      } catch (error) {
        console.error('Failed to add comment');
      } finally {
        setSubmittingComment(false);
      }
    },
  });

  if (loading || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8"><Loader /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
            <div className="flex items-center gap-4">
              <StatusBadge status={ticket.status as any} />
              <StatusBadge priority={ticket.priority} />
              <span className="text-sm text-gray-600">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <form onSubmit={statusFormik.handleSubmit} className="flex gap-2">
              <select
                value={statusFormik.values.status}
                onChange={statusFormik.handleChange}
                name="status"
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Update Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <Button type="submit" variant="primary" size="sm">Update</Button>
            </form>
            <Link to="/admin/tickets">
              <Button variant="secondary">← All Tickets</Button>
            </Link>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-xl text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500 block">Category</span>
              <span className="font-medium text-lg">{ticket.category}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">User</span>
              <span className="font-medium text-lg">{ticket.User?.name || ticket.User?.email}</span>
            </div>
          </div>
        </div>

        {/* Comments - LIVE UPDATES */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
          
          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-200 mx-auto max-w-3xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {comment.User?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-semibold text-gray-900 flex-shrink-0">
                      {comment.User?.name || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form onSubmit={commentFormik.handleSubmit} className="flex gap-4 justify-center max-w-3xl mx-auto p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <Input
              label="Add comment"
              name="content"
              value={commentFormik.values.content}
              onChange={commentFormik.handleChange}
              placeholder="Reply to user..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submittingComment || !commentFormik.values.content.trim()}
              className="flex-shrink-0"
            >
              {submittingComment ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetail;
