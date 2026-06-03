import React from 'react';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import BookManager from './pages/BookManager';
import LoanManager from './pages/LoanManager';
import CategoryPage from './pages/CategoryPage';
import BookCatalogPage from './pages/BookCatalogPage';
import HomePage from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path='/category' element={<ProtectedRoute><CategoryPage/></ProtectedRoute>}/>
        <Route path="/category/:categoryId" element={<ProtectedRoute><BookCatalogPage/></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard/></ProtectedRoute>}/>
        <Route path="/admin/books" element={<ProtectedRoute><BookManager /></ProtectedRoute>} />
        <Route path="/admin/loans" element={<ProtectedRoute><LoanManager /></ProtectedRoute>} />
       
       </Routes>
        </BrowserRouter>
  );
}     
export default App;
      