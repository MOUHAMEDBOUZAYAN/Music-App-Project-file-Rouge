import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Music } from 'lucide-react';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'listener' // 'listener' or 'artist'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic
      console.log('Registering with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (onRegister) {
        onRegister(formData);
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join SoundWave and start your music journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* User Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            I want to join as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              formData.userType === 'listener'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name="userType"
                value="listener"
                checked={formData.userType === 'listener'}
                onChange={handleChange}
                className="sr-only"
              />
              <User className="h-5 w-5 text-blue-500" />
              <span className="text-white font-medium">Listener</span>
            </label>
            
            <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              formData.userType === 'artist'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name="userType"
                value="artist"
                checked={formData.userType === 'artist'}
                onChange={handleChange}
                className="sr-only"
              />
              <Music className="h-5 w-5 text-blue-500" />
              <span className="text-white font-medium">Artist</span>
            </label>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className={`w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border border-red-500' : ''
                }`}
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={`w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border border-red-500' : ''
              }`}
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border border-red-500' : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            required
            className="mt-1 rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-400">
            I agree to the{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">Privacy Policy</a>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 