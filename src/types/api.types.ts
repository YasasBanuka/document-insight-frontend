// Common response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// The Document entity (matches your Java @Entity)
export interface Document {
  id: number;
  filename: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string; // Dates are strings in JSON
  userId: number;
  chunkCount?: number;
}

// Response when uploading a file
export interface UploadResponse {
  documentId: number;
  filename: string;
  message: string;
  fileSize: number;
  contentType: string;
}

// Stats for the dashboard
export interface UserStats {
  userId: number;
  totalDocuments: number;
}

// RAG Query Response
export interface RAGResponse {
  question: string;
  answer: string;
  contextChunks: number;
}

// Chat Message (Frontend-only model)
export interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  sources?: RAGSource[]; 
}

// Search Result (Individual chunk)
export interface SearchResult {
  id: number;
  chunk_index: number;
  content: string;
  token_count: number;
  filename: string;
  document_id: number;
  similarity: number;
}
// Paginated Search Response
export interface PaginatedSearchResponse {
  content: SearchResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Generic Paginated Response (used by documentApi)
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Chat Request
export interface ChatRequest {
  question: string;
  userId?: number;
  conversationId?: string;
}

// Chat Response
export interface ChatResponse {
  question?: string;
  answer: string;
  contextChunks?: number;
  sources?: RAGSource[];
}

// RAG Source (for displaying sources in the UI)
export interface RAGSource {
  filename: string;
  similarity: number;
  documentId: number;
}