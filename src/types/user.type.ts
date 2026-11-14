export interface User {
  id_user: number;
  role_id: number;
  username: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  status?: string;
  created_at?: string;
}

export interface AuthPayload {
  action: 'LOGIN' | 'REGISTER' | 'RE_LOGIN' | 'LOGOUT';
  data: {
    username?: string;
    password?: string;
    full_name?: string;
    phone_number?: string;
    re_login_code?: string;
  };
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    user: User;
    token?: string;
    re_login_code?: string;
  };
}