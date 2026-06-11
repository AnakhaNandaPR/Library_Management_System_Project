import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchStudentLoans = () => {
    const token = localStorage.getItem('token');
    /*axios.get('http://127.0.0.1:8000/api/loan/my_loans/', {*/
    axios.get('https://library-management-system-project-1.onrender.com/api/loan/my_loans/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setLoans(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading student loans", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchStudentLoans();
  }, []);

  const handleReturnItem = (loanId) => {
    const token = localStorage.getItem('token');
    setStatusMessage('Processing your return code...');

    /*axios.put(`http://127.0.0.1:8000/api/loan/${loanId}/request_return/`, {}, {*/
    axios.put(`https://library-management-system-project-1.onrender.com/api/loan/${loanId}/request_return/`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      setStatusMessage('🎉 Return request logged! Please hand the book physically to the Librarian.');
      fetchStudentLoans(); 
    })
    .catch(err => {
      setStatusMessage('Error executing return procedure.');
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Opening your loan account details...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Borrowed Books & Returns Desk</h2>
      <p>Track your active reading list and check for any outstanding late fees below:</p>

      {statusMessage && <div style={{ padding: '10px', background: '#fff3cd', color: '#856404', margin: '15px 0', borderRadius: '4px' }}>{statusMessage}</div>}

      {loans.length === 0 ? (
        <p style={{ marginTop: '20px', color: '#7f8c8d' }}>You do not have any borrowed book logs on record.</p>
      ) : (
        <table width="100%" cellPadding="12" style={{ borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f4f6f7', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th>Book Title</th>
              <th>Date Borrowed</th>
              <th>Due Date Deadline</th>
              <th>Return Status</th>
              <th>Fine Amount Due</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => {
            
              const isOverdue = !loan.returned_at && new Date() > new Date(loan.due_date);
              const isPendingLibrarian = loan.returned_at && loan.book_details && !loan.book_details.is_available;
              const isFullyClosed = loan.returned_at && (!loan.book_details || loan.book_details.is_available);

              return (
                <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td><strong>{loan.book_details?.title}</strong></td>
                  <td>{new Date(loan.borrowed_at).toLocaleDateString()}</td>
                  <td>{loan.due_date}</td>
                  <td>
                    {isFullyClosed ? (
    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Returned & Settled</span>
  ) : isPendingLibrarian ? (
    <span style={{ color: '#f39c12', fontWeight: 'bold' }}>⏳ Pending Verification</span>
  ) : isOverdue ? (
    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>OVERDUE</span>
  ) : (
    <span style={{ color: '#3498db' }}>Active Checkout</span>
  )}
                  </td>
                  <td>
                    {parseFloat(loan.fine_amount) > 0 ? (
                      <span style={{ color: '#c0392b', fontWeight: 'bold' }}>${loan.fine_amount}</span>
                    ) : (
                      <span style={{ color: '#27ae60' }}>$0.00</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleReturnItem(loan.id)} 
                      disabled={loan.returned_at !== null}
                      style={{ 
                        padding: '6px 12px', 
                        background: loan.returned_at ? '#e0e0e0' : '#e74c3c', 
                        color: loan.returned_at ? '#888' : 'white', 
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loan.returned_at ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isFullyClosed ? 'Settled' : isPendingLibrarian ? 'Awaiting Check-in' : 'Return Book'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentDashboard;