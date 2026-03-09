import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/token', `username=${username}&password=${password}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', response.data.access_token);
      onLogin();
    } catch (err) {
      setError('Incorrect username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2 mb-2 w-full" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
      <button type="button" onClick={() => navigate('/register')} className="bg-gray-500 text-white p-2 w-full rounded mt-2">Register</button>
    </form>
  );
};

export default LoginForm;
