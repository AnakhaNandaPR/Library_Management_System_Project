import React from 'react';
import {Link,useNavigate} from 'react-router-dom';
import '../App.css';
function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const isLibrarian=localStorage.getItem('is_staff')==='true';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

return (
    <nav style={{ 
      background: '#2c3e50', 
      padding: '15px 30px', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div>
        <Link to="/categories" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '22px' }}>
          📚 SmartLibrary
        </Link>
      </div>
      
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px', alignItems: 'center' }}>
        {token ? (
          <>
            
            <div style={{ borderRight:isLibrarian ?'2px solid #455a64':'none', paddingRight: '20px', display: 'flex', gap: '15px' }}>
              <li>
                <Link to="/category" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '15px' }}>
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '15px' }}>
                  My Book Dashboard
                </Link>
              </li>
            </div>
            
            
            {isLibrarian &&(
            <div style={{ display: 'flex', gap: '15px' }}>
              <li>
                <Link to="/admin/books" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
                  ⚙️ Stock Manager
                </Link>
              </li>
              <li>
                <Link to="/admin/loans" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
                  ⚙️ Circulation Logs
                </Link>
              </li>
            </div>
            )}
            
            <li style={{ marginLeft: '10px' }}>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  padding: '6px 14px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
              Sign In Gateway
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;



