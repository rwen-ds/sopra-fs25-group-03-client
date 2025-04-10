// /types/api.ts

export interface SignUpResponse {
    success?: boolean;
    message?: string;
    token?: string;
  }
  
  export interface LoginResponse {
    token: string;
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  }
  