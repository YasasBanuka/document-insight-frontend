import { ChatContainer } from '../features/chat/components/ChatContainer';

export function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ChatContainer />
      </div>
    </div>
  );
}