<div align="center">

<h1>⚡ Docura — Frontend</h1>
<h3><em>Intelligence for Your Documents</em></h3>
<p>React 18 · TypeScript · Vite · Zustand · Tailwind</p>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

*The React SPA for Docura — "Intelligence for Your Documents". Upload your files and chat with them using grounded, streaming AI responses.*

**[🔗 Backend Repo](https://github.com/YasasBanuka/document-insight-backend) · [🚀 Deployment Repo](https://github.com/YasasBanuka/docura-deployment) · [🌐 Live Demo](#)**

</div>

---

## ✨ Features

- **🔐 JWT Authentication** — Login, register, automatic token refresh, and protected routes.
- **📄 Document Library** — Drag-and-drop upload (PDF/DOCX/TXT), file management, and preview.
- **💬 RAG Chat Interface** — Ask questions about your documents and receive streamed AI answers (typewriter effect via SSE).
- **🗂️ Conversation History** — Persistent sidebar showing all past conversations, with delete support.
- **👤 User Profile** — Edit display name and email in-session.
- **📊 Semantic Search** — Paginated vector similarity search across your document library.
- **📱 Responsive Design** — Mobile-friendly layout with slide-out sidebar.
- **⚡ Rate Limit Handling** — User-friendly `429 Too Many Requests` toast notifications.

---

## 🏗️ Project Structure

```
src/
├── features/
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ConversationHistory.tsx  # Sidebar with past chat threads
│   │   │   ├── ChatInput.tsx            # Question input + submit
│   │   │   └── MessageBubble.tsx        # Renders QUESTION/ANSWER messages + sources
│   │   ├── hooks/
│   │   │   └── useChat.ts              # React Query mutations for chat API calls
│   │   └── api/
│   │       └── documentApi.ts          # All /api/documents/* API functions
│   │
│   └── documents/
│       └── components/
│           ├── DocumentLibrary.tsx      # Grid of uploaded documents
│           ├── DocumentCard.tsx         # Individual document tile
│           └── UploadZone.tsx           # React Dropzone + upload progress
│
├── contexts/
│   └── AuthContext.tsx                 # JWT state: tokens, user obj, refresh logic
│
├── services/
│   ├── authService.ts                  # login(), register(), transformAuthResponse()
│   └── apiClient.ts                    # Axios instance + request/response interceptors
│
├── store/
│   └── chatStore.ts                    # Zustand: active conversation, message list
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ChatPage.tsx
│   └── ProfilePage.tsx
│
├── types/
│   ├── auth.ts                         # BackendAuthResponse, User, AuthContextType
│   └── document.ts                     # DocumentDTO, ConversationDTO, MessageDTO
│
└── utils/                              # Date formatters, file size helpers
```

---

## 🔑 Key Technical Patterns

### JWT Token Management (`AuthContext.tsx`)

The `AuthContext` manages the full authentication lifecycle:
- Tokens are persisted in `localStorage` (`access_token`, `refresh_token`, `user`).
- On page reload, the stored user is restored instantly from `localStorage`.
- Axios response interceptor automatically retries any `401` request after refreshing the token.

```typescript
// Axios response interceptor pattern
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Refresh token → retry original request
    }
    return Promise.reject(error);
  }
);
```

### Server-Sent Events (SSE) Streaming

The RAG chat feature uses the browser's native `EventSource` API to receive Groq's LLaMA responses token-by-token, creating the typewriter effect without WebSocket complexity.

### React Query for Server State

All document lists and conversation histories are managed by **TanStack React Query**:
- Automatic caching and background re-fetching.
- After a new document upload or conversation creation, `queryClient.invalidateQueries()` triggers a background refresh of related lists.

### User Profile Sync

After `PUT /api/user/profile` succeeds, the `AuthContext` updates the in-memory `user` object and persists the new name to `localStorage`, keeping the sidebar display name in sync without requiring a re-login.

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- npm 10+
- Backend running at `http://localhost:8080` (see [backend README](https://github.com/YasasBanuka/document-insight-backend))

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# App available at: http://localhost:5173
# API requests are proxied to: http://localhost:8080 (via Vite config)
```

### Available Scripts

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Build production bundle to /dist
npm run preview    # Preview the production build locally
npm run test       # Run Vitest unit tests
npm run test:e2e   # Run Playwright E2E tests
npm run lint       # ESLint check
npm run type-check # TypeScript type checking (tsc --noEmit)
```

---

## 🧪 Testing

The frontend has full coverage across the testing pyramid:

| Layer | Tool | What's Tested |
|---|---|---|
| **Unit — Components** | Vitest + React Testing Library | `MessageBubble`, `ChatInput` render and interaction |
| **Unit — Hooks** | Vitest + `renderHook` | `useChat` mutation states, `useAuth` token refresh logic |
| **Unit — State** | Vitest + Zustand | Zustand chat store: conversation selection, history sync |
| **E2E** | Playwright | Full user journey: Register → Upload → Chat → History → Logout |

```bash
# Run all unit tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- src/features/chat/hooks/useChat.test.ts

# Run E2E tests (requires dev server running)
npm run test:e2e
```

---

## 🐳 Docker

The frontend uses a **two-stage Docker build**:
1. **Stage 1 (Node)**: Runs `npm run build` to produce the optimized static `/dist` bundle.
2. **Stage 2 (Nginx Alpine)**: Copies `/dist` into a lightweight Nginx container.

The `nginx.conf` (injected from the deployment repo) configures:
- `/api/*` requests → proxied to the backend container on port 8080.
- All other routes → served from `/dist/index.html` (enables React Router client-side routing).
- `proxy_buffering off` and `proxy_http_version 1.1` for SSE streaming support.

```bash
# Build and push for AWS EC2 (linux/amd64 required)
docker buildx build \
  --platform linux/amd64 \
  -t ybanuka/docura-frontend:latest \
  --push .
```

---

## ⚙️ Environment Configuration

For local development, the Vite dev server proxies API requests. No `.env` file is needed for the default setup.

For production Docker builds, the API base URL is set to `/api` (relative path), which Nginx resolves via `proxy_pass http://backend:8080/api/`.

---

## 🔗 Related Repositories

- **[docura-backend](https://github.com/YasasBanuka/document-insight-backend)** — Spring Boot 3 RAG engine, API, pgvector
- **[docura-deployment](https://github.com/YasasBanuka/docura-deployment)** — Docker Compose, AWS, Nginx, Prometheus, Grafana

---

<div align="center">
  <sub>Built by <strong>Yasas Banuka</strong> · React 18 · TypeScript · Vite · Zustand · Tailwind</sub>
</div>
