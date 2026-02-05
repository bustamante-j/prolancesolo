'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { storeSecurityQuestion, SECURITY_QUESTIONS } from '@/lib/authHelpers';
import PasswordInput from '@/components/ui/PasswordInput';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!securityQuestion || !securityAnswer.trim()) {
      setError('Please select a security question and provide an answer');
      return;
    }

    setLoading(true);

    try {
      // Register the user
      const success = await auth.register(email, password);
      if (success) {
        // Get the current user to store security question
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
          const securitySuccess = await storeSecurityQuestion(
            currentUser.uid,
            email,
            securityQuestion,
            securityAnswer
          );

          if (securitySuccess) {
            router.push('/tasks');
          } else {
            setError('Account created but failed to save security question. Please try logging in and updating your security settings.');
          }
        } else {
          setError('Account created but unable to save security information. Please try logging in.');
        }
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-3">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Join ProLance Lite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
              required
              disabled={loading}
            />
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
            label="Password"
            placeholder="Create a password"
            disabled={loading}
          />

          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            label="Confirm Password"
            placeholder="Confirm your password"
            disabled={loading}
          />

          <div>
            <label htmlFor="securityQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Question
            </label>
            <select
              id="securityQuestion"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
              required
              disabled={loading}
            >
              <option value="">Select a security question</option>
              {SECURITY_QUESTIONS.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Answer
            </label>
            <input
              type="text"
              id="securityAnswer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Your answer to the security question"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will help you reset your password if needed
            </p>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}