import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //handleLogin form for submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo(null);

    if (!validateEmail(email)) {
      setError("Please set a valid email address");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please set a password");
      setLoading(false);
      return;
    }

    setError("");    
    
    //Login APIs call
    try {
      console.log("Attempting login with:", { email, password });
      setDebugInfo("Sending request to: " + API_PATHS.AUTH.LOGIN);
      
      // Try using axios directly instead of the instance
      // const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      //   email,
      //   password
      // });
      
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email: email.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Login response:", response);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        setDebugInfo(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Server responded with status: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("No response received from server. Please check your connection.");
        setDebugInfo("No response received from server");
      } else {
        setError("Something went Wrong. Please try again later");
        setDebugInfo(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 mid:h-full flex flex-col justify-center relative top-20'>
        <h3 className='text-xl font-semibold text-purple-700'>Welcome Back!!!</h3>
        <p className='text-xs text-slate-600 mt-[5px] mb-6 '>Please enter your details to log in</p>
        
        {/* Test account section for easy testing */}
        <div className='bg-gray-100 p-3 mb-4 rounded-md'>
          <p className='text-xs font-semibold text-gray-700'>Test Account</p>
          <button 
            type='button' 
            className='text-xs bg-gray-200 px-2 py-1 rounded mt-1 text-blue-600'
            onClick={() => {
              setEmail('test@example.com');
              setPassword('password123');
            }}
          >
            Use Test Credentials
          </button>
          <p className='text-xs text-gray-500 mt-1'>Email: test@example.com / Password: password123</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <Input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="E-mail Address"
            placeholder='Jhone@example.com' />
          
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            placeholder='********' />
          
          <div className="flex justify-end mb-3">
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          {debugInfo && (
            <div className='bg-blue-50 p-2 mb-2 rounded border border-blue-200'>
              <p className='text-xs text-blue-800'><strong>Debug Info:</strong></p>
              <p className='text-xs text-blue-600 whitespace-pre-wrap'>{debugInfo}</p>
            </div>
          )}

          <button 
            type='submit' 
            className='btn-primary'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className='text-[13px] text-slate-800 mt-3' >Don't have an account?{ " " } <Link className="font-medium text-primary underline" to= "/signup">SignUp</Link></p>
        </form>
      </div>
    </AuthLayout>
  )
}
