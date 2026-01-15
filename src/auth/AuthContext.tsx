import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  type AuthUser,
  type LoginRequestDto,
  login as apiLogin,
  getCurrentUser,
} from '../api/authClient';

// Misma convención que en Angular AuthService
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  // Cuando haya token pero no usuario cargado, intenta obtenerlo del backend
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    // Si ya hay user en localStorage, no es obligatorio llamar al backend,
    // pero si quieres asegurarte de que el token es válido, puedes hacerlo:
    if (!user) {
      getCurrentUser(token)
        .then(fetchedUser => {
          setUser(fetchedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
        })
        .catch(() => {
          // Si falla, limpiamos sesión
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        });
    }
  }, [token, user]);

  const login = useCallback(async (credentials: LoginRequestDto) => {
    const resp = await apiLogin(credentials);
    // resp.token y resp.user vienen del backend
    setToken(resp.token);
    setUser(resp.user);
    localStorage.setItem(TOKEN_KEY, resp.token);
    localStorage.setItem(USER_KEY, JSON.stringify(resp.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}