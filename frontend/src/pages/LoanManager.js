import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoanManager() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalLoans();
  }, []);

  const fetchGlobalLoans = () => {
    
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/loan/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setLoans(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load campus checkout lines", err);
        setLoading(false);
      });
  };

  const handleReturnAsset = (loanId) => {
    const token = localStorage.getItem('token');
    axios.post(`http://127.0.0.1:8000/api/loan/${loanId}/confirm_return/`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        alert("✅ Verification successful! Book restored to catalog inventory values.");
        
        
        setLoans(prevLoans => 
          prevLoans.map(item => 
            item.id === loanId 
              ? { ...item, book_details: { ...item.book_details, is_available: true } }
              : item
          )
        );
        
        fetchGlobalLoans(); 
      })
      .catch(err => console.error("Error logging textbook return action", err));
  };

  if (loading) return <h3>Loading Circulation Database logs...</h3>;
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #f1c40f', paddingBottom: '10px' }}>
        ⚙️ Librarian System Panel: Circulation Logs
      </h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
        Monitoring all active off-campus school book placements, late tracking returns, and automated student debt structures.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Txn ID</th>
            <th style={{ padding: '12px' }}>Student Profile Account</th>
            <th style={{ padding: '12px' }}>Book Asset Title</th>
            <th style={{ padding: '12px' }}>Checkout Date</th>
            <th style={{ padding: '12px' }}>Expected Due Date</th>
            <th style={{ padding: '12px' }}>Accrued Fines</th>
            <th style={{ padding: '12px' }}>Current Activity State</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Action Command</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => {
            
            const hasStudentRequestedReturn = loan.returned_at !== null && loan.returned_at !== undefined;
            const isBookRestocked = loan.book_details?.is_available === true;

            return (
              <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>#{loan.id}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>
                  {loan.student_username || `Account ID: ${loan.student}`}
                </td>
               
                <td style={{ padding: '12px', color: '#2c3e50' }}>{loan.book_details?.title || `Book ID: ${loan.book}`}</td>
                <td style={{ padding: '12px' }}>{loan.borrowed_at}</td>
                <td style={{ padding: '12px', color: '#c0392b', fontWeight: '500' }}>{loan.due_date}</td>
                <td style={{ padding: '12px', color: parseFloat(loan.fine_amount) > 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                  ₹{loan.fine_amount}
                </td>

                
                <td style={{ padding: '12px' }}>
                  {hasStudentRequestedReturn && isBookRestocked ? (
                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', color: 'white', backgroundColor: '#27ae60', fontWeight: 'bold' }}>
                      Returned & Closed
                    </span>
                  ) : hasStudentRequestedReturn ? (
                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', color: 'white', backgroundColor: '#e67e22', fontWeight: 'bold' }}>
                      ⏳ Awaiting Check-In
                    </span>
                  ) : (
                    <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', color: 'white', backgroundColor: '#f39c12' }}>
                      Active Off-Campus Loan
                    </span>
                  )}
                </td>

                
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {hasStudentRequestedReturn && !isBookRestocked ? (
                    <button 
                      onClick={() => handleReturnAsset(loan.id)}
                      style={{ background: '#2ecc71', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Receive Return ✅
                    </button>
                  ) : !hasStudentRequestedReturn ? (
                    <span style={{ color: '#7f8c8d', fontSize: '12px', fontStyle: 'italic' }}>With Student</span>
                  ) : (
                    <span style={{ color: '#bdc3c7', fontSize: '12px', fontStyle: 'italic' }}>Archive Complete</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LoanManager;








