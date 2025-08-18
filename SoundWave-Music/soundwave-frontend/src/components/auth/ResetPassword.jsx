import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { useSpotify } from '../../store/SpotifyContext';

const ResetPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: spotifyLogin, loading: spotifyLoading } = useSpotify();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Implement actual password reset logic
      console.log('Sending reset email to:', email);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400">
            We've sent a password reset link to{' '}
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Send Another Email
          </button>
          
          <button
            onClick={onBackToLogin}
            className="w-full text-gray-400 hover:text-white transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email address"
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </button>
        </div>

        {/* Spotify Login Option */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-3">
            Ou connectez-vous avec Spotify
          </p>
          <button
            type="button"
            onClick={spotifyLogin}
            disabled={spotifyLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {spotifyLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSpotify className="h-5 w-5" />
            )}
            Continuer avec Spotify
          </button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white font-medium mb-2">Need help?</h3>
        <p className="text-gray-400 text-sm">
          If you're having trouble accessing your account, contact our support team at{' '}
          <a href="mailto:support@soundwave.com" className="text-blue-500 hover:text-blue-400">
            support@soundwave.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword; 