const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5195';

export interface AuthUser {
  username: string;
  email: string;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: AuthUser;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

async function postJson<TBody, TResponse>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<TResponse>;
}

export async function login(body: LoginRequestDto): Promise<LoginResponseDto> {
  // Usa la MISMA ruta que en AuthApiService de Angular
  return postJson<LoginRequestDto, LoginResponseDto>('/api/auth/login', body);
}

export async function register(body: RegisterRequestDto): Promise<void> {
  await postJson<RegisterRequestDto, unknown>('/api/auth/register', body);
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to load user: ${res.status}`);
  }

  return res.json() as Promise<AuthUser>;
}