'use client'; // Mark this as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the base URL as a constant
const API_BASE_URL = 'http://localhost:3001';

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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all notes
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Note[]>(`${API_BASE_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
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
        await axios.put(`${API_BASE_URL}/notes/${editId}`, formData);
      } else {
        // Add new note
        await axios.post(`${API_BASE_URL}/notes`, formData);
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
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${API_BASE_URL}/notes/${id}`);
        fetchNotes(); // Refresh the list
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Notes</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.button}>
          {editId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <h2 style={styles.subHeading}>Notes List</h2>
      {isLoading ? (
        <p style={styles.loading}>Loading...</p>
      ) : notes.length === 0 ? (
        <p style={styles.emptyState}>No notes found. Add a new note to get started!</p>
      ) : (
        <ul style={styles.notesList}>
          {notes.map((note) => (
            <li key={note._id} style={styles.noteItem}>
              <h3 style={styles.noteTitle}>{note.title}</h3>
              <p style={styles.noteContent}>{note.content}</p>
              <div style={styles.buttonGroup}>
                <button onClick={() => handleEdit(note)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(note._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// CSS Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    minHeight: '100px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  subHeading: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '15px',
  },
  notesList: {
    listStyleType: 'none',
    padding: '0',
  },
  noteItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },
  noteTitle: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '10px',
  },
  noteContent: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
};