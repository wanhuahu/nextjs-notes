'use client'; // Mark this as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get<Note[]>('http://localhost:3001/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing note
        await axios.put(`http://localhost:3001/notes/${editId}`, formData);
      } else {
        // Add new note
        await axios.post('http://localhost:3001/notes', formData);
      }
      setFormData({ title: '', content: '' });
      setEditId(null);
      fetchNotes(); // Refresh the list
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Handle editing a note
  const handleEdit = (note: Note) => {
    setFormData({ title: note.title, content: note.content });
    setEditId(note._id);
  };

  // Handle deleting a note
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);
      fetchNotes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Notes</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{editId ? 'Update Note' : 'Add Note'}</button>
      </form>

      <h2>Notes List</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ marginBottom: '10px' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}