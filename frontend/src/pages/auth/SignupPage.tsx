import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe2, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { signupSchema, SignupFormData } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { APP_NAME, APP_TAGLINE } from '../../constants';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await signup(data);
      success('Account Created!', `Welcome to GlobeTrotter, ${data.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toastError('Registration Failed', err.response?.data?.message || err.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Left Hero */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1C1C1E] text-white overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-35 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')`,
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

        {/* Testimonial */}
        <div className="relative z-20 max-w-lg space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
            Join thousands of travelers planning unforgettable journeys.
          </h2>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[#aeaeb2] italic">
              "GlobeTrotter turned our 3-week chaotic multi-city Europe trip into a crystal clear, budgeted, stress-free adventure."
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8E8E93]">
              <span className="font-semibold text-white">Sophia & Marcus</span> — Frequent Travelers
            </div>
          </div>
        </div>

        <div className="relative z-20 text-xs text-[#8E8E93]">
          © {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#1C1C1E] p-8 sm:p-10 rounded-2xl shadow-card border border-black/[0.08] dark:border-white/[0.10]">
          <div>
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] text-white">
                <Globe2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">{APP_NAME}</span>
            </div>

            <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Create an account
            </h2>
            <p className="mt-1 text-xs text-[#6E6E73] dark:text-[#98989D]">
              Start planning multi-city itineraries and tracking travel costs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="Alex Rivera"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@globetrotter.io"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium shadow-xs"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#007AFF] dark:text-[#0A84FF] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
