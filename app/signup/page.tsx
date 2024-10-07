"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
    const supabaseUrl = "https://ahaxfqkzgbyovatyexfh.supabase.co"; // Replace with your Supabase URL
    const supabaseAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXhmcWt6Z2J5b3ZhdHlleGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNzE2MzcsImV4cCI6MjAzMDY0NzYzN30.LmTYUkwy4buaCMAVZmS0_Wj9JS-EZpe75BebmGVWWn0"; // Replace with your Supabase anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [organization, setOrganization] = useState('ORDA'); // Default organization
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    // Insert user data into Supabase
    const { error } = await supabase.from('user').insert([
      { first_name: firstName, last_name: lastName, email, password, phone_no: phoneNo, organization }
    ]);

    setLoading(false);

    if (error) {
      console.error('Error creating user:', error);
      setMessage('Error creating user');
    } else {
      setMessage('Account created successfully');
      router.push('/login'); // Redirect to login page
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <motion.div
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-700 dark:text-gray-200">Create an Account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              required
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              required
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
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
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
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
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone_no"
              type="tel"
              required
              placeholder="123-456-7890"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Organization
            </label>
            <select
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="ORDA">ORDA</option>
              <option value="IIRR">IIRR</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500 dark:text-red-400">{message}</p>}

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-black-600 hover:underline dark:text-blue-400">
            Already have an account? Log in
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
