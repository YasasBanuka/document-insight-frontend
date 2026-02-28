# ⚡ Docura Frontend: Testing Guide

> **Intelligence for Your Documents** — A complete reference for the Docura frontend test suite, covering test tooling, configuration, conventions, and all key test scenarios.

---

## Table of Contents
1. [Testing Philosophy](#1-testing-philosophy)
2. [Tooling Setup](#2-tooling-setup)
3. [Unit Tests — Components](#3-unit-tests--components)
4. [Unit Tests — Hooks](#4-unit-tests--hooks)
5. [Unit Tests — Store](#5-unit-tests--store)
6. [Unit Tests — Context](#6-unit-tests--context)
7. [End-to-End Tests — Playwright](#7-end-to-end-tests--playwright)
8. [Running Tests](#8-running-tests)
9. [Writing New Tests](#9-writing-new-tests)

---

## 1. Testing Philosophy

The Docura frontend test suite follows the **Testing Trophy** model recommended by Kent C. Dodds for React applications:

```
         ┌─────────────────────┐
         │      E2E Tests      │  ← Playwright (fewest, highest confidence)
         │      (fewest)       │
         ├─────────────────────┤
         │  Integration Tests  │  ← React Testing Library hook + context tests
         ├─────────────────────┤
         │    Unit Tests       │  ← Component render + Zustand store (most)
         └─────────────────────┘
              Static Analysis   ← TypeScript + ESLint (always on)
```

**Key principle**: Test *behaviour*, not *implementation*. A good test asserts what the user sees or experiences, not which function was called internally.

---

## 2. Tooling Setup

| Tool | Purpose | Config File |
|---|---|---|
| **Vitest** | Unit & integration test runner | `vite.config.ts` (`test` block) |
| **React Testing Library** | DOM-based component rendering | `src/setupTests.ts` |
| **@testing-library/user-event** | Simulates real browser user interactions | — |
| **Playwright** | Browser E2E test automation | `playwright.config.ts` |
| **vitest/coverage-v8** | Code coverage reporting | `vite.config.ts` |

**`src/setupTests.ts`** runs before every test file:
```typescript
import '@testing-library/jest-dom'; // Adds .toBeInTheDocument(), .toHaveValue(), etc.
```

---

## 3. Unit Tests — Components

### `MessageBubble.test.tsx`
**File:** `src/features/chat/components/MessageBubble.test.tsx`

Tests the rendering logic of the chat bubble component.

**Key test scenarios:**

| Test | Assertion |
|---|---|
| Renders question bubble | User message bubble renders with correct content, right-aligned |
| Renders answer bubble | AI answer renders content, left-aligned |
| Renders loading skeleton | When `isLoading: true`, `Skeleton` component is shown, content is not |
| Renders source citations | When `sources` array provided, document filename and similarity score chips render |
| Renders empty sources | When `sources: []`, no citation section renders |

---

### `ChatInput.test.tsx`
**File:** `src/features/chat/components/ChatInput.test.tsx`

Tests the input behaviour of the chat form.

**Key test scenarios:**

| Test | Assertion |
|---|---|
| Submits on Enter | Pressing Enter calls `onSendMessage` callback with input value |
| No submit on Shift+Enter | Pressing Shift+Enter adds newline, does NOT call callback |
| Disabled while loading | When `isLoading: true`, submit button is `disabled`, input has `disabled` attribute |
| Clears after submit | After submit, input value resets to `""` |

---

## 4. Unit Tests — Hooks

### `useChat.test.tsx`
**File:** `src/features/chat/hooks/useChat.test.tsx`

Tests the chat hook's interaction with the Zustand store and mocked `documentApi`.

**Setup pattern:**
```typescript
// Wrapper required because the hook depends on QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

**Key test scenarios:**

| Test | Scenario | Assertion |
|---|---|---|
| Optimistic UI on send | `sendMessage('Hello')` called | Store immediately has 2 messages: `question` and `isLoading: true` |
| Loading resolves | After API mock resolves | `messages[1].content === 'Hello from AI'`, `isLoading: false` |
| Load conversation | `loadConversation(1)` with mocked API | `conversationId === 1`, `messages.length === 1`, content matches |

**Exact assertion from test:**
```typescript
// Immediately after sendMessage("Hello"):
expect(useChatStore.getState().messages).toHaveLength(2);
expect(useChatStore.getState().messages[0].type).toBe('question');
expect(useChatStore.getState().messages[1].isLoading).toBe(true);

// After API resolves:
await waitFor(() => expect(useChatStore.getState().isLoading).toBe(false));
expect(useChatStore.getState().messages[1].content).toBe('Hello from AI');
```

---

## 5. Unit Tests — Store

### `chatStore.test.ts`
**File:** `src/store/chatStore.test.ts`

Tests all Zustand store actions in isolation — no React rendering needed.

**Key test scenarios:**

| Test | Action | Assertion |
|---|---|---|
| `addMessage` | Adds a message | `messages.length` increases by 1 |
| `updateMessage` | Updates specific message by ID | Only target message changes, others intact |
| `setConversationId` | Sets ID | `conversationId` matches |
| `clearChat` | Resets state | `messages: []`, `conversationId: null`, `isLoading: false` |

**Pattern — direct store access without React:**
```typescript
// No render() needed — Zustand stores are plain objects
useChatStore.getState().addMessage({ id: '1', type: 'question', content: 'Hello' });
expect(useChatStore.getState().messages).toHaveLength(1);
```

---

## 6. Unit Tests — Context

### `AuthContext.test.tsx`
**File:** `src/contexts/AuthContext.test.tsx`

Tests the `AuthContext` provider's state transitions, localStorage interactions, and error handling.

**Mock pattern:**
```typescript
vi.mock('../services/authService'); // Mock the HTTP layer

// Wrap component under test in AuthProvider
const { result } = renderHook(() => useAuth(), {
  wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>
});
```

**Key test scenarios:**

| Test | Scenario | Assertion |
|---|---|---|
| Initial state | No localStorage data | `user: null`, `isAuthenticated: false`, `loading: false` |
| Restore from localStorage | Tokens in localStorage on mount | `isAuthenticated: true`, user object populated |
| Login success | `authService.login` resolves | `user` set, `isAuthenticated: true`, `localStorage` updated |
| Login 429 handling | `error.response.status === 429` | No duplicate error toast shown (interceptor handles it) |
| Logout | `logout()` called | `user: null`, all localStorage keys cleared |
| `updateUser` | Edit profile | `user.name` updated in state AND `localStorage.getItem('user')` |

---

## 7. End-to-End Tests — Playwright

**Config:** `playwright.config.ts`

Playwright tests cover complete user journeys from a real browser perspective. They run against the **dev server** (`npm run dev`).

### Full User Journey Test

The primary E2E test covers the entire application workflow:

```
1. Navigate to /register
2. Fill in name, email, password → Submit
3. Assert redirect to /chat (or /documents)
4. Navigate to /documents → Upload a PDF file
5. Assert document appears in document library with chunk count
6. Navigate to /chat → Type a question → Submit
7. Assert AI answer renders (non-empty content)
8. Assert source citation chip appears
9. Navigate to /register → Assert conversation appears in sidebar history
10. Click sidebar conversation → Assert messages reload correctly
11. Click logout → Assert redirect to /login
12. Assert protected routes (/chat, /documents) redirect to /login
```

### Rate Limit E2E Test

Tests the user-facing behaviour when rate limits are hit.

```
1. Login → Send 21 chat messages rapidly
2. Assert toast notification appears: "🚫 Rate limited! Please wait 60 seconds"
3. Assert the 22nd request is NOT sent to the server
```

---

## 8. Running Tests

```bash
# Run all Vitest unit/integration tests (watch mode)
npm run test

# Run once with coverage report
npm run test -- --coverage

# Run a specific test file
npm run test -- src/features/chat/hooks/useChat.test.tsx

# Run tests matching a name pattern
npm run test -- -t "sendMessage"

# Run Playwright E2E (requires dev server running in another terminal)
npm run dev        # Terminal 1
npm run test:e2e   # Terminal 2

# Run a specific Playwright test file
npx playwright test e2e/auth.spec.ts

# View Playwright test report (HTML)
npx playwright show-report
```

---

## 9. Writing New Tests

### Component Test Template

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should respond to user interaction', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<MyComponent onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
```

### Mocking `documentApi`

```typescript
import { vi } from 'vitest';
import { documentApi } from '../../documents/api/documentApi';

vi.mock('../../documents/api/documentApi');

// In your test:
vi.mocked(documentApi.createConversation).mockResolvedValue({
  answer: 'Mocked answer',
  conversationId: 42,
  sources: []
});
```

### Store Reset Between Tests

Always reset Zustand store state between tests to prevent state pollution:

```typescript
beforeEach(() => {
  useChatStore.getState().clearChat();
  vi.clearAllMocks();
});
```
