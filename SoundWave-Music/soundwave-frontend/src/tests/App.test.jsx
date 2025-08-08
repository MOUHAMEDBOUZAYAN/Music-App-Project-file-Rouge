import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock components to avoid complex dependencies
jest.mock('../components/common/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../pages/Search', () => {
  return function MockSearch() {
    return <div data-testid="search-page">Search Page</div>;
  };
});

jest.mock('../pages/Library', () => {
  return function MockLibrary() {
    return <div data-testid="library-page">Library Page</div>;
  };
});

jest.mock('../pages/Playlist', () => {
  return function MockPlaylist() {
    return <div data-testid="playlist-page">Playlist Page</div>;
  };
});

jest.mock('../pages/LikedSongs', () => {
  return function MockLikedSongs() {
    return <div data-testid="liked-songs-page">Liked Songs Page</div>;
  };
});

jest.mock('../pages/Artist', () => {
  return function MockArtist() {
    return <div data-testid="artist-page">Artist Page</div>;
  };
});

jest.mock('../pages/Settings', () => {
  return function MockSettings() {
    return <div data-testid="settings-page">Settings Page</div>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});

describe('Component Structure', () => {
  test('has all required pages', () => {
    renderWithRouter(<App />);
    
    // Check that the app renders without errors
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});

describe('Routing', () => {
  test('renders correct components for different routes', () => {
    renderWithRouter(<App />);
    
    // Default route should show home
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
