import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', { username, email, password });
      const response = await api.post('/token', `username=${username}&password=${password}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', response.data.access_token);
      onRegister();
    } catch (err) {
      setError('Error registering, email may be taken');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2 mb-2 w-full" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 mb-2 w-full" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Register</button>
      <button type="button" onClick={() => navigate('/login')} className="bg-gray-500 text-white p-2 w-full rounded mt-2">Back to Login</button>
    </form>
  );
};

export default RegisterForm;
