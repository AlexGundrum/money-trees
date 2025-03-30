// frontend/components/Login.jsx
"use client"; // Needs to be a client component for useState and event handling

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Login = () => { // Component name convention
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Get router instance

  const handleSubmit = (e) => { // No type annotation needed for 'e'
    e.preventDefault();
    // **Hackathon Fake Login:**
    console.log("Login attempt (Fake):", { email, password });
    // Navigate to the dashboard page on successful fake login
    router.push('/dashboard'); // Redirects to the page within the (main) group
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-blue-800">Login to FinStudent</h1>
          <p className="text-gray-600 mt-2">Manage your finances with confidence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </Link> */}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        {/* <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Register
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;