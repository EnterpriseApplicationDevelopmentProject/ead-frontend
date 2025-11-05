"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const emailValue = formData.get('email') as string;

    // Simulate API call
    setTimeout(() => {
      // Mock validation - check if email exists
      const validEmails = [
        'admin@autocare.com',
        'mike.johnson@autocare.com',
        'david.smith@autocare.com',
        'robert.brown@autocare.com',
        'james.wilson@email.com',
        'john.doe@email.com',
        'sarah.johnson@email.com',
      ];

      if (!validEmails.includes(emailValue)) {
        setError('No account found with this email address');
        setLoading(false);
        return;
      }

      // Success
      setEmail(emailValue);
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-gray-600 text-sm mb-6">
              We've sent a password reset link to:
            </p>
            
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-800">{email}</p>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gray-900 text-white font-semibold py-2 rounded-full hover:bg-gray-800 transition"
              >
                Back to Login
              </button>
              
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="w-full text-blue-600 font-semibold py-2 hover:underline"
              >
                Resend Email
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Back to Login Link */}
          <button
            onClick={() => router.push('/auth/login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">FORGOT PASSWORD</h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mock Email Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-2">Test Email Addresses:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>admin@autocare.com</p>
              <p>mike.johnson@autocare.com</p>
              <p>james.wilson@email.com</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold py-2 rounded-full hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'SEND RESET LINK'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/auth/login" className="font-semibold text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/auth/signup" className="font-semibold text-blue-600 hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
