import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import MenuBar from './components/Menubar.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MainPage from './pages/MainPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import { AuthContext } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
    <MenuBar />
    <Toaster />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/generate' element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route path='/preview' element={
          <ProtectedRoute>
            <PreviewPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
