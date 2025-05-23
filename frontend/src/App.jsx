import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Auth/Login";
import SignUp from "./page/Auth/SignUp";
import ForgetPassword from "./page/Auth/ForgetPassword.jsx";
import ResetPassword from "./page/Auth/ResetPassword.jsx";
import Home from "./page/Dashboard/Home";
import Expense from "./page/Dashboard/Expense";
import Income from "./page/Dashboard/Income"
import RecentTransactions from "./page/Dashboard/RecentTransactions.jsx";
import UserProvider from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import TestPDF from './components/TestPDF.jsx';

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={ <Root/>}  />
            <Route path='login' exact element={<Login />} />
            <Route path='signup' exact element={<SignUp />} />
            <Route path='forgot-password' exact element={<ForgetPassword />} />
            <Route path='reset-password/:token' exact element={<ResetPassword />} />
            <Route path='dashboard' exact element={ <Home />}  />
            <Route path='income' exact element={ <Income/>}  />
            <Route path='expense' exact element={<Expense />} />
            <Route path='transactions' exact element={<RecentTransactions />} />
            <Route path='test-pdf' exact element={<TestPDF />} />
          </Routes>
        </Router>
      </div>
      <Toaster 
        toastOptions={{
          className: "",
          style: { fontSize: '13px' },
        }}
      />
    </UserProvider>
  )
}

export default App


const Root = () => {
  // check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if isAuthenticated, otherwise Navigate to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to = "/login" />
  )
}