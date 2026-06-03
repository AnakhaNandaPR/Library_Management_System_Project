import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
useEffect(() => {
    
    axios.get('http://127.0.0.1:8000/api/category/')
     
    .then(response => {
      setCategories(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading categories", err);
      setError('Failed to load library categories. Ensure your backend server is running.');
      setLoading(false);
    });
  }, []);
  if (loading) return <div style={{ padding: '20px' }}>Loading Library Departments...</div>;
  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to the Student Library Portal</h2>
      <p>Select a department category below to browse available books:</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div >
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => navigate(`/category/${cat.id}`)}
           
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3>{cat.name}</h3>
            <p >{cat.description || "No description provided."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;