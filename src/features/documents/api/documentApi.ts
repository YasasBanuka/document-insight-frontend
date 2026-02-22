import type {
  Document,
  UploadResponse,
  SearchResult,
  PaginatedResponse,
  ChatRequest,
  ChatResponse,
  RAGSource
} from '../../../types/api.types';
import { apiClient } from '../../../api/axiosConfig';

export interface ConversationDTO {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageDTO[];
}

export interface MessageDTO {
  id: number;
  type: string;
  content: string;
  sources?: RAGSource[];
  createdAt: string;
}

export const documentApi = {
  // Upload a document
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<UploadResponse>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get all documents
  getAll: async (): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>('/documents');

    return response.data;
  },

  // Delete a document
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Search documents (using paginated endpoint)
  searchDocuments: async (
    query: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<SearchResult>> => {
    const response = await apiClient.get<PaginatedResponse<SearchResult>>(
      '/documents/search/paginated',
      {
        params: { query, page, size },
      }
    );
    return response.data;
  },

  // Ask a question (RAG) - GET endpoint
  askQuestion: async (question: string): Promise<ChatResponse> => {
    const response = await apiClient.get<ChatResponse>('/documents/ask', {
      params: { question },
    });
    return response.data;
  },

  // Chat with RAG
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chat', request);
    return response.data;
  },

  // Get document content/preview
  getDocumentContent: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${id}/content`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document preview as text (for DOCX/TXT)
  getDocumentPreview: async (id: number): Promise<string> => {
    const response = await apiClient.get<string>(`/documents/${id}/preview`);
    return response.data;
  },

  // Create new conversation
  createConversation: async (question: string): Promise<ChatResponse & { conversationId: number }> => {
    const response = await apiClient.post<ConversationDTO>('/documents/conversations', {
      question
    });

    // Return in format useChat expects
    const lastMessage = response.data.messages[response.data.messages.length - 1];
    return {
      answer: lastMessage.content,
      sources: lastMessage.sources,
      conversationId: response.data.id,
    };
  },

  // Add message to existing conversation
  addToConversation: async (conversationId: number, question: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ConversationDTO>(`/documents/conversations/${conversationId}/messages`, {
      question
    });

    const lastMessage = response.data.messages[response.data.messages.length - 1];
    return {
      answer: lastMessage.content,
      sources: lastMessage.sources,
    };
  },

  // Get conversation by ID
  getConversation: async (id: number): Promise<ConversationDTO> => {
    const response = await apiClient.get<ConversationDTO>(`/documents/conversations/${id}`);
    return response.data;
  },

  // Get all conversations
  getConversations: async (): Promise<ConversationDTO[]> => {
    const response = await apiClient.get<ConversationDTO[]>('/documents/conversations');
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/conversations/${id}`);
  },

};

