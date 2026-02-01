export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'instructor' | 'student'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'instructor' | 'student'
}

export interface AuthResponse {
  user: User
  token: string
}
