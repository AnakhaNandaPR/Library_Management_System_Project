import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookCatalogPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  

  useEffect(() => {
    
    /*axios.get(`http://127.0.0.1:8000/api/book/by_category/${categoryId}/`)*/
    axios.get(`https://library-management-system-project-1.onrender.com/api/book/by_category/${categoryId}/`)
     
    .then(response => {
      setBooks(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading books", err);
      setLoading(false);
    });
  }, [categoryId]);

  const handleBorrow = (bookId) => {
    const token = localStorage.getItem('token');
    setMessage('Processing your borrow request...');

    
    /*axios.post('http://127.0.0.1:8000/api/loan/', { book_id: bookId }*/
    axios.post('https://library-management-system-project-1.onrender.com/api/loan/', { book_id: bookId }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      setMessage('🎉 Book borrowed successfully! Go to your dashboard to track your return deadline.');
     
      setBooks(books.map(b => b.id === bookId ? { ...b, is_available: false } : b));
    })
    .catch(err => {
      setMessage(err.response?.data?.detail || 'Transaction failed.');
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Filtering catalog inventory...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/category')} style={{ marginBottom: '20px', padding: '5px 10px' }}>← Back to Categories</button>
      
      <h2>Books in this Category</h2>
      
      {message && <div style={{ background: '#e1f5fe', padding: '12px', borderRadius: '4px', margin: '15px 0', color: '#0288d1' }}>{message}</div>}
      
      {books.length === 0 ? (
        <p>No books registered in this department yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {books.map(book => (
            <div key={book.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{book.title}</h4>
                <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Author: {book.author} | ISBN: {book.isbn} | Published: {book.published_date}</p>
              </div>
              
              <button 
                onClick={() => handleBorrow(book.id)} 
                disabled={!book.is_available}
                style={{ 
                  backgroundColor: book.is_available ? '#2ecc71' : '#bdc3c7', 
                  color: 'white', 
                  border: 'none',
                  padding: '10px 15px', 
                  borderRadius: '4px',
                  cursor: book.is_available ? 'pointer' : 'not-allowed'
                }}
              >
                {book.is_available ? 'Borrow Book' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookCatalogPage;