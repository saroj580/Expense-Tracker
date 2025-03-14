import React, { useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handleLogin form for submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please set a valid email address");
      return;
    }

    if (!password) {
      setError("Please set a password");
      return;
    }

    setError("");    
    
    //Login APIs call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went Wrong. Please try again later");
      }
    }

  }
  
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 mid:h-full flex flex-col justify-center relative top-20'>
        <h3 className='text-xl font-semibold text-purple-700'>Welcome Back!!!</h3>
        <p className='text-xs text-slate-600 mt-[5px] mb-6 '>Please enter your details to log in</p>
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
          
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-[13px] text-slate-800 mt-3' >Don't have an account?{ " " } <Link className="font-medium text-primary underline" to= "/signup">SignUp</Link></p>
        </form>
      </div>
    </AuthLayout>
  )
}
