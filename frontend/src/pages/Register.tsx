import React, { useState } from 'react';
import { useFormik, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const formik = useFormik<FormValues>({
    initialValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await authAPI.completeRegistration({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        login(response.data.user);
        console.log('✅ Registration complete');
        navigate('/');
      } catch (error: any) {
        console.error('Registration failed:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const getFieldError = (field: keyof FormValues): string | undefined => {
    return formik.touched[field] && formik.errors[field] ? String(formik.errors[field]) : undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-md mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Account
            </h1>
            <div className="flex w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full w-full" />
            </div>
          </div>
 
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
 
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('name')}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('email')}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('password')}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('confirmPassword')}
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full text-lg py-3" 
              loading={loading}
              disabled={!formik.isValid || loading}
            >
              Sign Up & Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
