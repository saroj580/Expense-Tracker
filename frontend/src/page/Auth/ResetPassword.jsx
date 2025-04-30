import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LuLock, LuEye, LuEyeOff, LuCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export default function ResetPassword() {
  const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verify the token when the component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.VERIFY_RESET_TOKEN(token));
        setIsValidToken(response.data.valid);
      } catch (error) {
        console.error('Token verification error:', error);
        setIsValidToken(false);
        toast.error('Invalid or expired reset link. Please request a new one.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      verifyToken();
    } else {
      setIsValidToken(false);
      setIsLoading(false);
    }
  }, [token]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('Please enter both password fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        token,
        password
      });
      
      setResetComplete(true);
      toast.success(response.data.message || 'Password reset successful');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }
  
  // Show invalid token message
  if (!isValidToken && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. 
              Please request a new password reset link.
            </p>
            <Link 
              to="/forgot-password" 
              className="block w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {resetComplete ? 'Password Reset Complete' : 'Reset Your Password'}
          </h2>
          
          {resetComplete ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <LuCheck className="text-green-500 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link 
                to="/login" 
                className="block w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">
                Enter your new password below.
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                      placeholder="New password"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <LuEyeOff className="text-gray-400 hover:text-gray-500" />
                      ) : (
                        <LuEye className="text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuLock className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 