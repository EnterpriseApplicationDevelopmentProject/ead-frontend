"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock user credentials with roles
const mockUsers = [
  { email: 'admin@automobile.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'customer@automobile.com', password: 'customer123', role: 'customer', name: 'Customer User' },
  { email: 'employee@automobile.com', password: 'employee123', role: 'employee', name: 'Employee User' },
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
    
    // Simulate authentication
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'customer':
            router.push('/customer/dashboard');
            break;
          case 'employee':
            router.push('/employee/dashboard');
            break;
          default:
            router.push('/');
        }
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold mb-2">LOGIN</h1>
        <p className="text-gray-600 text-sm mb-6">
          If you have an account with us, please log in.
        </p>

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
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Demo credentials info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-left">
          <p className="font-semibold text-blue-900 mb-1">Demo Credentials:</p>
          <p className="text-blue-800">Admin: admin@automobile.com / admin123</p>
          <p className="text-blue-800">Customer: customer@automobile.com / customer123</p>
          <p className="text-blue-800">Employee: employee@automobile.com / employee123</p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold hover:underline">
            Create an account
          </a>{" "}
          or{" "}
          <a href="/request-reset" className="font-semibold hover:underline">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;