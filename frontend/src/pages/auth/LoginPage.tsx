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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Left side: Hero Banner */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1C1C1E] text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-35 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/70 to-[#1C1C1E]/40 z-10" />

        {/* Logo */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-xs">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">{APP_NAME}</h1>
            <p className="text-xs text-[#aeaeb2] font-medium">{APP_TAGLINE}</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/30 text-[#64D2FF] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Travel Command Center</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
            Transform ideas into seamless multi-city expeditions.
          </h2>

          <div className="space-y-2.5 pt-2">
            {[
              'Interactive visual day-by-day itinerary builder',
              'Real-time budget tracking & smart expense forecasts',
              'Global city discovery with cost indexes & top activities',
              'Shareable travel itineraries for companions & group planning',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-[#aeaeb2]">
                <CheckCircle2 className="w-4 h-4 text-[#30D158] flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-20 text-xs text-[#8E8E93]">
          © {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#1C1C1E] p-8 sm:p-10 rounded-2xl shadow-card border border-black/[0.08] dark:border-white/[0.10]">
          {/* Form Header */}
          <div>
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] text-white">
                <Globe2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">{APP_NAME}</span>
            </div>

            <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-[#6E6E73] dark:text-[#98989D]">
              Sign in to access your journeys and continue your travels.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@globetrotter.io"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline"
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

            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium shadow-xs"
              >
                Sign In
              </Button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2 text-xs font-semibold text-[#007AFF] dark:text-[#0A84FF] bg-blue-500/10 hover:bg-blue-500/15 rounded-lg transition-colors border border-blue-500/20 cursor-pointer"
              >
                ⚡ Fill Demo Credentials (alex@globetrotter.io)
              </button>
            </div>
          </form>

          {/* Switch to Signup */}
          <div className="text-center pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:underline">
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
        <form onSubmit={handleForgotSubmit} className="space-y-3 pt-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex@globetrotter.io"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForgotModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-[#007AFF] text-white">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
