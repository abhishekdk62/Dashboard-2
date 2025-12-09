import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';
import { useFormik } from 'formik';
import { ticketsAPI } from '../api';
import { Ticket, Comment } from '../types';
import { useSocket } from '../hooks/useSocket'; // ✅ NEW IMPORT

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const { data } = await ticketsAPI.getTicket(Number(id));
        setTicket(data);
        setComments(data.Comments || []);
      } catch (error) {
        console.error('Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // Add comment formik
  const commentFormik = useFormik({
    initialValues: { content: '' },
    onSubmit: async (values) => {
      if (!id || !ticket) return;
      
      setSubmitting(true);
      try {
        await ticketsAPI.addComment(Number(id), values.content);
        commentFormik.resetForm();
      } catch (error) {
        console.error('Failed to add comment');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Ticket Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ticket.priority === 'low' ? 'bg-green-100 text-green-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ticket.priority.toUpperCase()}
                </span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Link to="/">
              <Button variant="secondary">← Back to Tickets</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 block">Category</span>
                <span className="font-medium">{ticket.category}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Priority</span>
                <span className="font-medium capitalize">{ticket.priority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section - LIVE UPDATES */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
          
          <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 max-w-md mx-auto">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl max-w-3xl mx-auto">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.User?.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 truncate">
                        {comment.User?.name || 'User'}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={commentFormik.handleSubmit} className="flex gap-3 p-4 justify-center bg-gray-50 rounded-2xl border border-gray-200">
              <Input
                label="Add a comment"
                name="content"
                value={commentFormik.values.content}
                onChange={commentFormik.handleChange}
                error={commentFormik.errors.content}
                className="flex-1"
                placeholder="Type your comment here..."
              />
              <Button 
                type="submit" 
                variant="primary" 
                disabled={submitting || !commentFormik.values.content.trim()}
                className="px-8 flex-shrink-0"
              >
                {submitting ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
