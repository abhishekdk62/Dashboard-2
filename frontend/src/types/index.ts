export interface User {
    id: number;
    email: string;
    role: 'user' | 'admin';
    name?: string;
  }
  
  export interface Ticket {
    id: number;
    User?:{
      name:string;
      email:string
    }
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    userId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Comment {
    id: number;
    User?:{
      name:string
    }
    ticketId: number;
    userId: number;
    content: string;
    createdAt: string;
  }
  
  export enum Status {
    OPEN = 'open',
    IN_PROGRESS = 'in-progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
  }
  
export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'support', label: 'Support' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' }
] as const;
