import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PromptForm from './components/PromptForm';
import PromptCard from './components/PromptCard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SearchBar from './components/SearchBar';
import api from './services/api';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrompts();
    }
  }, [isAuthenticated, search, category]);

  const fetchPrompts = async () => {
    try {
      const response = await api.get('/prompts/', { params: { search, category } });
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchPrompts();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/prompts/import/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchPrompts();
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/prompts/export/');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prompts.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">PromptBase</h1>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 mb-4 rounded">Logout</button>
            <SearchBar onSearch={setSearch} onCategory={setCategory} />
            <PromptForm onSubmit={fetchPrompts} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {prompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} onUpdate={fetchPrompts} />
              ))}
            </div>
            <div className="mt-4">
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                Import JSON
                <input type="file" onChange={handleImport} className="hidden" accept=".json" />
              </label>
              <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded ml-4">Export JSON</button>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm onRegister={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
