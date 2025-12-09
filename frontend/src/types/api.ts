export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      email: string;
      role: 'user' | 'admin';
    };
  }
  
  export interface TicketStats {
    total: number;
    open: number;
    resolved: number;
    closed: number;
  }
  