
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  username: string;
  role: 'Admin' | 'Customer';
}

export interface UserDTO {
  username: string;
  email: string;
  role: 'Admin' | 'Customer';
  isActive: boolean;
}


