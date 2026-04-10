export interface User {
  id: number;
  email: string;
  fullName: string;
  roleName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
