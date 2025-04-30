import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuMail } from 'react-icons/lu';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      
      setEmailSent(true);
      toast.success(response.data.message || 'Password reset link sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to process your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>
          
          {emailSent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <LuMail className="text-green-500 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Check your email</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to your email address. 
                Please check your inbox (and spam folder) to reset your password.
              </p>
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="w-full text-center py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                >
                  Return to Login
                </Link>
                <button 
                  onClick={() => setEmailSent(false)} 
                  className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
                >
                  Try another email
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                      placeholder="Your email address"
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
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
                
                <div className="text-center">
                  <Link to="/login" className="text-primary hover:underline text-sm">
                    Return to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 