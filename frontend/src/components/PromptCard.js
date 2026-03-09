import React, { useState } from 'react';
import api from '../services/api';

const PromptCard = ({ prompt, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({...prompt, tags: prompt.tags ? prompt.tags.join(',') : ''});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) };
    try {
      await api.put(`/prompts/${prompt.id}`, data);
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/prompts/${prompt.id}`);
      onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input name="title" value={formData.title} onChange={handleChange} className="border p-1 mb-2 w-full" />
          <input name="category" value={formData.category} onChange={handleChange} className="border p-1 mb-2 w-full" />
          <textarea name="prompt_text" value={formData.prompt_text} onChange={handleChange} className="border p-1 mb-2 w-full" />
          <input name="comment" value={formData.comment} onChange={handleChange} className="border p-1 mb-2 w-full" />
          <input name="tags" value={formData.tags} onChange={handleChange} className="border p-1 mb-2 w-full" placeholder="Tags, comma separated" />
          <button type="submit" className="bg-blue-500 text-white p-2">Save</button>
          <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 text-white p-2 ml-2">Cancel</button>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-bold">{prompt.title}</h2>
          <p><strong>Category:</strong> {prompt.category}</p>
          <p><strong>Prompt:</strong> {prompt.prompt_text}</p>
          <p><strong>Comment:</strong> {prompt.comment}</p>
          <p><strong>Tags:</strong> {prompt.tags ? prompt.tags.join(', ') : 'None'}</p>
          <p><strong>Created by:</strong> {prompt.created_by} on {new Date(prompt.created_at).toLocaleString()}</p>
          <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white p-2 mr-2 rounded">Edit</button>
          <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete</button>
        </>
      )}
    </div>
  );
};

export default PromptCard;
