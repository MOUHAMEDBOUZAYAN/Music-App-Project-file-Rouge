import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { AppProvider } from './store/index.jsx';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import Artist from './pages/Artist';
import Settings from './pages/Settings';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ResetPassword from './components/auth/ResetPassword';
import UploadSong from './components/artist/UploadSong';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Routes protégées avec Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                
                {/* Routes nécessitant une authentification */}
                <Route path="library" element={
                  <ProtectedRoute requireAuth={true}>
                    <Library />
                  </ProtectedRoute>
                } />
                
                <Route path="playlist" element={
                  <ProtectedRoute requireAuth={true}>
                    <Playlist />
                  </ProtectedRoute>
                } />
                
                <Route path="liked" element={
                  <ProtectedRoute requireAuth={true}>
                    <LikedSongs />
                  </ProtectedRoute>
                } />
                
                <Route path="artist" element={<Artist />} />
                
                <Route path="settings" element={
                  <ProtectedRoute requireAuth={true}>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* Routes nécessitant le rôle d'artiste */}
                <Route path="upload" element={
                  <ProtectedRoute requireAuth={true} requireArtist={true}>
                    <UploadSong />
                  </ProtectedRoute>
                } />
                
                {/* Routes pour les artistes (dashboard, analytics, etc.) */}
                <Route path="dashboard" element={
                  <ProtectedRoute requireAuth={true} requireArtist={true}>
                    <div>Dashboard Artiste</div>
                  </ProtectedRoute>
                } />
                
                <Route path="analytics" element={
                  <ProtectedRoute requireAuth={true} requireArtist={true}>
                    <div>Analytics</div>
                  </ProtectedRoute>
                } />
                
                {/* Routes administrateur */}
                <Route path="admin" element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <div>Panel Administrateur</div>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Route 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-gray-400">Page non trouvée</p>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
