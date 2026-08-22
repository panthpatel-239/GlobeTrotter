import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe2, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { APP_NAME, APP_TAGLINE } from '../../constants';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex@globetrotter.io',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      success('Welcome back!', `Logged in as ${data.email}`);
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError('Login Failed', err.response?.data?.message || err.message || 'Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setValue('email', 'alex@globetrotter.io');
    setValue('password', 'password123');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toastError('Invalid Email', 'Please enter a valid email address');
      return;
    }
    success('Password Reset Link Sent', `Check ${forgotEmail} for reset instructions.`);
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Left side: Hero Banner */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden border-r border-slate-800">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-35 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40 z-10" />

        {/* Logo */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-400 text-white shadow-md shadow-blue-500/25">
            <Globe2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white">{APP_NAME}</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Travel Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            Transform ideas into seamless multi-city expeditions.
          </h2>

          <div className="space-y-3 pt-2">
            {[
              'Interactive visual day-by-day itinerary builder',
              'Real-time budget tracking & smart expense forecasts',
              'Global city discovery with cost indexes & top activities',
              'Shareable travel itineraries for companions & group planning',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-20 text-xs text-slate-500">
          © {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
          {/* Form Header */}
          <div>
            <div className="flex lg:hidden items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Globe2 className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">{APP_NAME}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sign in to access your journeys and continue your travels.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@globetrotter.io"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/25 rounded-xl py-2.5"
              >
                Sign In
              </Button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-800/60 cursor-pointer"
              >
                ⚡ Fill Demo Credentials (alex@globetrotter.io)
              </button>
            </div>
          </form>

          {/* Switch to Signup */}
          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        description="Enter your registered email to receive a password reset link."
        maxWidth="sm"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-3.5 pt-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@globetrotter.io"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForgotModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
