import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Auth/Login";
import SignUp from "./page/Auth/SignUp";
import Home from "./page/Dashboard/Home";
import Expense from "./page/Dashboard/Expense";
import Income from "./page/Dashboard/Income"
import UserProvider from './context/userContext';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/' element={ <Root/>}  />
          <Route path='login' exact element={<Login />} />
          <Route path='signup' exact element={<SignUp />} />
          <Route path='dashboard' exact element={ <Home />}  />
          <Route path='income' exact element={ <Income/>}  />
          <Route path='expense' exact element={ <Expense/>}  />
        </Routes>
      </Router>
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