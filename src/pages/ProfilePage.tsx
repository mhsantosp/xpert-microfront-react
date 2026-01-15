import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) {
    // En teoría no deberías llegar aquí porque está protegido por ProtectedRoute
    return <p>No hay usuario cargado.</p>;
  }

  return (
    <div className="profile-page">
      <h1>Perfil</h1>
      <p>
        <strong>Usuario:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}