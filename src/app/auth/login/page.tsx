"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock user database
const MOCK_USERS = [
  // Admin
  { email: 'admin@autocare.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  
  // Employees
  { email: 'mike.johnson@autocare.com', password: 'employee123', role: 'employee', name: 'Mike Johnson' },
  { email: 'david.smith@autocare.com', password: 'employee123', role: 'employee', name: 'David Smith' },
  { email: 'robert.brown@autocare.com', password: 'employee123', role: 'employee', name: 'Robert Brown' },
  
  // Customers
  { email: 'james.wilson@email.com', password: 'customer123', role: 'customer', name: 'James Wilson' },
  { email: 'john.doe@email.com', password: 'customer123', role: 'customer', name: 'John Doe' },
  { email: 'sarah.johnson@email.com', password: 'customer123', role: 'customer', name: 'Sarah Johnson' },
];

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Find user in mock database
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    // Store user info in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
    }));

    // Redirect based on role
    setTimeout(() => {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'employee') {
        router.push('/employee/dashboard');
      } else if (user.role === 'customer') {
        router.push('/customer/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-2 text-center">LOGIN</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            If you have an account with us, please log in.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mock Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800 mb-2">Test Credentials:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Admin:</strong> admin@autocare.com / admin123</p>
              <p><strong>Employee:</strong> mike.johnson@autocare.com / employee123</p>
              <p><strong>Customer:</strong> james.wilson@email.com / customer123</p>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-full hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account?{" "}
            <a href="/auth/signup" className="font-semibold text-blue-600 hover:underline">
              Create an account
            </a>
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            <a href="/auth/forgot-password" className="font-semibold text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;