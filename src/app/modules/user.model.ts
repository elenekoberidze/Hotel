
export interface User {
  username: string;
  email: string;
  role: 'Admin' | 'Customer';
  isActive: boolean;
}

