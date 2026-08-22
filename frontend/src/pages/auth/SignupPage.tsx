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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Left Hero */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden border-r border-slate-800">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-35 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')`,
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

        {/* Testimonial */}
        <div className="relative z-20 max-w-lg space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            Join thousands of travelers planning unforgettable journeys.
          </h2>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "GlobeTrotter turned our 3-week chaotic multi-city Europe trip into a crystal clear, budgeted, stress-free adventure."
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="font-bold text-white">Sophia & Marcus</span> — Frequent Travelers
            </div>
          </div>
        </div>

        <div className="relative z-20 text-xs text-slate-500">
          © {new Date().getFullYear()} GlobeTrotter Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex lg:hidden items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Globe2 className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">{APP_NAME}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Create an account
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Start planning multi-city itineraries and tracking travel costs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/25 rounded-xl py-2.5"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
