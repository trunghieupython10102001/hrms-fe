/** user's role */
export type Role = 'guest' | 'admin';

export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResult {
  user: {
    username: string;
    id: string | number;
  };
  accessToken: string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}
