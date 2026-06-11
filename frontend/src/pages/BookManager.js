import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookManager() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingBookId, setEditingBookId] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [category, setCategory] = useState('');

  const isLibrarian=localStorage.getItem('is_staff')==="true";
  const token=localStorage.getItem('token');

  const apiConfig={
    headers:{
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const booksRes = await axios.get('https://library-management-system-project-1.onrender.com/api/book/');
      const catsRes = await axios.get('https://library-management-system-project-1.onrender.com/api/category/');
      /*const booksRes = await axios.get('http://127.0.0.1:8000/api/book/');*/
      /*const catsRes = await axios.get('http://127.0.0.1:8000/api/category/');*/
      setBooks(booksRes.data);
      setCategories(catsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Admin data fetch failed", err);
      setLoading(false);
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn || !category) {
      alert("Please fill in all mandatory fields");
      return;
    }

    const bookPayload = {
      title,
      author,
      isbn,
      published_date: publishedDate || null, 
      category: parseInt(category)
    };

    if (editingBookId) {
      axios.put(`https://library-management-system-project-1.onrender.com/api/book/${editingBookId}/`, bookPayload,apiConfig)
      
      /*axios.put(`http://127.0.0.1:8000/api/book/${editingBookId}/`, bookPayload,apiConfig)*/
        .then(() => {
          alert("Book records updated successfully!");
          cancelEdit(); 
          fetchData(); 
        })
        .catch(err => console.error("Could not update book details", err));
    } else {
      axios.post('https://library-management-system-project-1.onrender.com/api/book/', bookPayload,apiConfig)
      
     /* axios.post('http://127.0.0.1:8000/api/book/', bookPayload,apiConfig)*/
        .then(() => {
          alert("New book registered successfully!");
          cancelEdit(); 
          fetchData(); 
        })
        .catch(err => console.error("Could not add book", err));
    }
  };

  const startEdit = (book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn || book.isbn_code || ''); 
    setPublishedDate(book.published_date || '');
    setCategory(book.category || '');
  };

  
  const cancelEdit = () => {
    setEditingBookId(null);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setPublishedDate('');
    setCategory('');
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to permanently delete this book?")) {
      try {
        await axios.delete(`https://library-management-system-project-1.onrender.com/api/book/${bookId}/`,apiConfig);
        /*await axios.delete(`http://127.0.0.1:8000/api/book/${bookId}/`,apiConfig);*/
        alert("Book deleted successfully.");
        fetchData(); 
      } catch (err) {
        alert("Could not delete book. It might be currently borrowed by a student.");
      }
    }
  };

  
  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        <h3>Loading Administrative Terminal Stock Logs...</h3>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #f1c40f', paddingBottom: '10px' }}>
      {isLibrarian ? "⚙️ Librarian System Panel: Stock Manager": "Student Library Catalog"}
      </h2>

      {isLibrarian && (
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>
          {editingBookId ? "📝 Edit Catalog Asset Details" : "Add New Asset to Catalog Inventory"}
        </h3>
        <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input type="text" placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="ISBN Barcode" value={isbn} onChange={(e) => setIsbn(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: '1 / span 2' }}>
            <option value="">-- Assign Library Department Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
    
          <button 
            type="submit" 
            style={{ 
              gridColumn: editingBookId ? '1' : '1 / span 2', 
              background: editingBookId ? '#2980b9' : '#27ae60', 
              color: 'white', 
              padding: '12px', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            {editingBookId ? "Apply Changes" : "Add Book to Database"} 
          </button>
  
          {editingBookId && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              style={{ 
                gridColumn: '2',
                backgroundColor: '#7f8c8d', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      )}

      
      <h3>Current Physical Inventory Stock Logs</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Author</th>
            <th style={{ padding: '12px' }}>ISBN</th>
            <th style={{ padding: '12px' }}>Department</th>
            <th style={{ padding: '12px' }}>Status</th>
            
           {isLibrarian && <th style={{ padding: '12px' }}>Management Actions</th> }
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{book.id}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{book.title}</td>
              <td style={{ padding: '12px' }}>{book.author}</td>
              <td style={{ padding: '12px', color: '#7f8c8d' }}>{book.isbn}</td>
              <td style={{ padding: '12px' }}>{book.category_name || `ID: ${book.category}`}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'white', backgroundColor: book.is_available ? '#2ec4b6' : '#e74c3c' }}>
                  {book.is_available ? 'In Stock' : 'Checked Out'}
                </span>
              </td>
              {isLibrarian && (
              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => startEdit(book)} 
                  style={{ backgroundColor: '#f1c40f', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Edit
                </button>
                <button 
                  type="button" 
                  onClick={() => handleDelete(book.id)} 
                  style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookManager;