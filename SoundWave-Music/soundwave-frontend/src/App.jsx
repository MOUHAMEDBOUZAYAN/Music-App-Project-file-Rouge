import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/AuthContext';
import { MusicProvider } from './store/MusicContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import LikedSongs from './pages/LikedSongs';
import Playlist from './pages/Playlist';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Genres from './pages/Genres';
import PopularAlbums from './pages/PopularAlbums';
import PopularSongs from './pages/PopularSongs';
import NewReleases from './pages/NewReleases';
// import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151'
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff'
                  }
                }
              }}
            />
            
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Routes protégées avec layout Spotify */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/search" element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/genres" element={
                <ProtectedRoute>
                  <Layout>
                    <Genres />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/popular-albums" element={
                <ProtectedRoute>
                  <Layout>
                    <PopularAlbums />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/popular-songs" element={
                <ProtectedRoute>
                  <Layout>
                    <PopularSongs />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/new-releases" element={
                <ProtectedRoute>
                  <Layout>
                    <NewReleases />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/library" element={
                <ProtectedRoute>
                  <Layout>
                    <Library />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/liked-songs" element={
                <ProtectedRoute>
                  <Layout>
                    <LikedSongs />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/playlist/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <Playlist />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/artist/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <Artist />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/album/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <Album />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } /> */}
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
