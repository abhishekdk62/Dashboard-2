import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginSchema, registerSchema } from '../utils/validation';
import { authAPI } from '../api';
import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(true); // ✅ NEW STATE
  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ ADMIN CREDENTIALS POPUP - Auto-hide after 10s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdminPopup(false);
    }, 15000); // Hide after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const getFieldError = (field: keyof typeof formik.errors) => {
    return formik.touched[field] && formik.errors[field] ? String(formik.errors[field]) : undefined;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    validationSchema: isRegister ? registerSchema : loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        if (isRegister) {
          await authAPI.register(values.name, values.email, values.password);
          navigate('/');
        } else {
          const response = await authAPI.login(values.email, values.password);
          console.log('Login successful:', response.data);
          login(response.data.user)
        }
      } catch (error: any) {
        setError(error.response?.data?.error || 'Something went wrong');
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* ✅ ADMIN CREDENTIALS POPUP */}
      {showAdminPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50  bg-orange-400 text-white p-4 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full mx-4 backdrop-blur-sm ">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg"> Testing Credentials for admin login</h3>
         
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono bg-white/20 px-2 py-1 rounded text-xs">email :</span>
              <span>admin@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-white/20 px-2 py-1 rounded text-xs">password :</span>
              <span>admin123</span>
            </div>
          </div>
          <div className="mt-3 text-xs opacity-90 text-center">
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard Support
          </h1>
          <p className="text-gray-600">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {isRegister && (
            <Input
              label="Full Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={getFieldError('name')}
            />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={getFieldError('email')}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={getFieldError('password')}
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword(!showPassword)}
          />

          {err && (
            <div className="p-3 text-center bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {err}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full text-lg py-3"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Don't have account? Create One 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
