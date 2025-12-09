// pages/CreateTicket.tsx → components/CreateTicketModal.tsx
import React from 'react';
import { useFormik } from 'formik';
import Button from '../components/Button';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { ticketSchema } from '../utils/validation';
import { CreateTicketData, ticketsAPI } from '../api';
import { PRIORITIES, CATEGORIES } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Refresh tickets list
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();

  const formik = useFormik<CreateTicketData>({
    initialValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      status: 'open',  // ← ADD THIS LINE ONLY

    },
    validationSchema: ticketSchema,
    onSubmit: async (values) => {
      try {
        await ticketsAPI.createTicket(values);
        onSuccess?.(); 
        onClose();
      } catch (error) {
        console.error('Failed to create ticket');
      }
    },
  });

  const getFieldError = (field: string) => {
    return formik.touched[field as keyof typeof formik.errors] 
      && formik.errors[field as keyof typeof formik.errors] 
      ? String(formik.errors[field as keyof typeof formik.errors]) 
      : undefined;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create New Ticket
          </h2>
          <Button 
            variant="ghost" 
            className="text-gray-500 hover:text-gray-900 p-2 -m-2"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={getFieldError('title')}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={6}
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 border-gray-200 hover:border-gray-300 bg-white resize-vertical"
              placeholder="Describe your issue in detail..."
            />
            {getFieldError('description') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('description')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category"
              name="category"
              as="select"
              value={formik.values.category}
              onChange={formik.handleChange}
              options={CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
              error={getFieldError('category')}
              required
            />

            <Input
              label="Priority"
              name="priority"
              as="select"
              value={formik.values.priority}
              onChange={formik.handleChange}
              options={PRIORITIES.map(prio => ({ value: prio.value, label: prio.value }))}
              error={getFieldError('priority')}
              required
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" variant="primary" className="flex-1 text-lg py-4">
              {formik.isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 text-lg py-4"
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
