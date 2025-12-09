import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Password must be 6+ chars').required('Password required'),
});

export const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Password must be 6+ chars').required('Password required'),
  name: yup.string().required('Name required'),
});

export const ticketSchema = yup.object({
  title: yup.string().min(5, 'Title too short').max(100).required('Title required'),
  description: yup.string().min(10, 'Description too short').required('Description required'),
  category: yup.string().required('Category required'),
  priority: yup.string().required('Priority required'),
});
