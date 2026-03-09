import React, { useState } from 'react';
import api from '../services/api';

const PromptForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    prompt_text: '',
    comment: '',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) };
    try {
      await api.post('/prompts/', data);
      onSubmit();
      setFormData({
        title: '',
        category: '',
        prompt_text: '',
        comment: '',
        tags: ''
      });
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 gap-2">
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="border p-2" />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border p-2" />
      <textarea name="prompt_text" placeholder="Prompt Text" value={formData.prompt_text} onChange={handleChange} className="border p-2" />
      <input name="comment" placeholder="Comment" value={formData.comment} onChange={handleChange} className="border p-2" />
      <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="border p-2" />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Prompt</button>
    </form>
  );
};

export default PromptForm;
