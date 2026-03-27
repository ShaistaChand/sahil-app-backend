// client/src/pages/Register.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import CountrySelector from '../components/auth/CountrySelector';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const registerUser = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const country = data.country || undefined;
    const res = await registerUser(data.name, data.email, data.password, country);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-6">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className="logo-icon">€</div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>Sahil App</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Split bills, not friendship</p>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Create Account</h2>
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>Start tracking your expenses in minutes</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="alert alert-error"><AlertCircle size={16} /><span style={{ marginLeft: 8 }}>{error}</span></div>}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} type="text" className={`form-input ${errors.name ? 'error' : ''}`} style={{ paddingLeft: 40 }} placeholder="Enter your full name" disabled={isLoading} />
            </div>
            {errors.name && <div className="form-error"><AlertCircle size={14} />{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' } })} type="email" className={`form-input ${errors.email ? 'error' : ''}`} style={{ paddingLeft: 40 }} placeholder="Enter your email" disabled={isLoading} />
            </div>
            {errors.email && <div className="form-error"><AlertCircle size={14} />{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} type={showPassword ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="Create a password" disabled={isLoading} />
              <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <div className="form-error"><AlertCircle size={14} />{errors.password.message}</div>}
          </div>

          <CountrySelector />

          <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
            {isLoading ? <> <div className="loading-spinner" /> Creating Account... </> : 'Create Account'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-light)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ padding: '0 1rem' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => alert('Google login coming soon!')}>Continue with Google</button>
            <button type="button" className="btn btn-outline" onClick={() => alert('LinkedIn login coming soon!')}>Continue with LinkedIn</button>
            <button type="button" className="btn btn-outline" onClick={() => alert('Facebook login coming soon!')}>Continue with Facebook</button>
          </div>

          <div className="text-center mt-4">
            <span style={{ color: 'var(--text-light)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
