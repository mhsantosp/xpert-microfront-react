import { Routes, Route } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './auth/ProtectedRoute';

// import './App.css'

export function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
