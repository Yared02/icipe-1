// pages/login.tsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion'; // For animations
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const LoginPage = () => {

  const supabaseUrl = "https://ahaxfqkzgbyovatyexfh.supabase.co"; // Replace with your Supabase URL
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXhmcWt6Z2J5b3ZhdHlleGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNzE2MzcsImV4cCI6MjAzMDY0NzYzN30.LmTYUkwy4buaCMAVZmS0_Wj9JS-EZpe75BebmGVWWn0"; // Replace with your Supabase anon key
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('password', password) // Note: Passwords should be hashed in production
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error('Error fetching user:', error);
      setMessage('Error fetching user');
      return;
    }

    if (user) {
      // Store user data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem('id', user.id || '');

        localStorage.setItem('first_name', user.first_name || '');

        localStorage.setItem('last_name', user.last_name || '');
        localStorage.setItem('email', user.email || '');
        localStorage.setItem('phone_no', user.phone_no || '');
        localStorage.setItem('organization', user.organization || '');
      }

      // Redirect to the home page
      window.location.href = '/'; // Replace with your URL
  
    
    
    } else {
      setMessage('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-gray-100 dark:bg-gray-950">
      <motion.div
        className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-700 dark:text-gray-200">Welcome Back</h1>
        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">Please enter your credentials to sign in.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500 dark:text-red-400">{message}</p>}

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Forgot your password?
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Don’t have an account?</p>
          <a href="/signup" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Create an account
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
