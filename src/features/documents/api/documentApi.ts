import axios from 'axios';
import type {
  Document,
  UploadResponse,
  SearchResult,
  PaginatedResponse,
  ChatRequest,
  ChatResponse
} from '../../../types/api.types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentApi = {
  // Upload a document
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get all documents
  getAll: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>('/documents');
    return response.data;
  },

  // Delete a document
  delete: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  // Search documents (using paginated endpoint)
  searchDocuments: async (
    query: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<SearchResult>> => {
    const response = await api.get<PaginatedResponse<SearchResult>>('/documents/search/paginated', {
      params: { query, page, size },
    });
    return response.data;
  },

  // Ask a question (RAG) - GET endpoint
  askQuestion: async (question: string): Promise<ChatResponse> => {
    const response = await api.get<ChatResponse>('/documents/ask', {
      params: { question },
    });
    return response.data;
  },

  // Chat with RAG
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', request);
    return response.data;
  },

  // Get document content/preview (NEW)
  getDocumentContent: async (id: number): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/content`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document preview as text (for DOCX/TXT) (NEW)
  getDocumentPreview: async (id: number): Promise<string> => {
    const response = await api.get<string>(`/documents/${id}/preview`);
    return response.data;
  },
};

export default api;