import api from './api';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'account' | 'farms' | 'soil' | 'weather';
  order: number;
}

export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  assigned_to?: number;
}

export interface TicketComment {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user_name: string;
  is_staff: boolean;
}

export interface CreateTicketDto {
  subject: string;
  description: string;
  priority: SupportTicket['priority'];
  category: string;
}

export interface AddCommentDto {
  message: string;
}

const helpAndSupportService = {
  // FAQ Methods
  getAllFaqs: async (): Promise<FAQ[]> => {
    const response = await api.get('/help/faqs');
    return response.data;
  },

  getFaqsByCategory: async (category: FAQ['category']): Promise<FAQ[]> => {
    const response = await api.get(`/help/faqs?category=${category}`);
    return response.data;
  },

  searchFaqs: async (query: string): Promise<FAQ[]> => {
    const response = await api.get(`/help/faqs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Support Ticket Methods
  createTicket: async (ticketData: CreateTicketDto): Promise<SupportTicket> => {
    const response = await api.post('/support/tickets', ticketData);
    return response.data;
  },

  getMyTickets: async (): Promise<SupportTicket[]> => {
    const response = await api.get('/support/tickets/my');
    return response.data;
  },

  getTicketById: async (id: number): Promise<SupportTicket> => {
    const response = await api.get(`/support/tickets/${id}`);
    return response.data;
  },

  updateTicketStatus: async (id: number, status: SupportTicket['status']): Promise<SupportTicket> => {
    const response = await api.patch(`/support/tickets/${id}/status`, { status });
    return response.data;
  },

  // Ticket Comments
  getTicketComments: async (ticketId: number): Promise<TicketComment[]> => {
    const response = await api.get(`/support/tickets/${ticketId}/comments`);
    return response.data;
  },

  addTicketComment: async (ticketId: number, comment: AddCommentDto): Promise<TicketComment> => {
    const response = await api.post(`/support/tickets/${ticketId}/comments`, comment);
    return response.data;
  },

  // Help Documentation
  getHelpArticles: async (category?: string): Promise<any[]> => {
    const response = await api.get('/help/articles', {
      params: category ? { category } : undefined
    });
    return response.data;
  },

  getArticleById: async (id: number): Promise<any> => {
    const response = await api.get(`/help/articles/${id}`);
    return response.data;
  },

  searchHelpArticles: async (query: string): Promise<any[]> => {
    const response = await api.get(`/help/articles/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default helpAndSupportService;