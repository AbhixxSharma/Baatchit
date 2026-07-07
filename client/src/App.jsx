import React from 'react'
import Login from './Components/Login'
import Register from './Components/Register';
import { Route,Routes } from 'react-router-dom'




 function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
