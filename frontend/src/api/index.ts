import axiosInstance from "./axios";
import { User, Ticket, Comment } from "../types";

export const authAPI = {
  sendOtp: (email: string) =>
    axiosInstance.post(
      "/api/auth/send-otp",
      { email },
      { withCredentials: true }
    ),

  verifyOtp: (data: { email: string; otp: string }) =>
    axiosInstance.post("/api/auth/verify-otp", data, { withCredentials: true }),

  completeRegistration: (data: {
    name: string;
    email: string;
    password: string;
  }) =>
    axiosInstance.post("/api/auth/complete-registration", data, {
      withCredentials: true,
    }),

  login: (email: string, password: string) =>
    axiosInstance.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true }
    ),

  register: (name: string, email: string, password: string) =>
    axiosInstance.post(
      "/api/auth/register",
      { name, email, password },
      { withCredentials: true }
    ),
};
export type CreateTicketData = Pick<Ticket, 'title' | 'description' | 'category' | 'priority' | 'status'>;

export const ticketsAPI = {
  getUserTickets: () => axiosInstance.get<Ticket[]>("/api/tickets/my"),
  createTicket: (ticket: CreateTicketData) =>
    axiosInstance.post<Ticket>("/api/tickets", ticket),
  getTicket: (id: number) =>
    axiosInstance.get<Ticket & { Comments: Comment[] }>(`/api/tickets/${id}`),
  getTicketAdmin: (id: number) =>
    axiosInstance.get<Ticket & { Comments: Comment[] }>(`/api/tickets/admin/${id}`),
  updateStatus: (id: number, status: string) =>
    axiosInstance.patch(`/api/tickets/${id}`, { status }),
  getAllTickets: () => axiosInstance.get<Ticket[]>("/api/tickets"),
  addComment: (ticketId: number, content: string) =>
    axiosInstance.post(`/api/tickets/${ticketId}/comments`, { content }),
};

export const analyticsAPI = {
  getStats: () =>
    axiosInstance.get<{ total: number; open: number; resolved: number }[]>(
      "/api/analytics"
    ),
};

export const meAPI = {
  getMe: () => axiosInstance.get<User>("/api/auth/me"),
  logout: () => axiosInstance.post("/api/auth/logout"),
};
