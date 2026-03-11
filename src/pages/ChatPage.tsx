import { ChatContainer } from '../features/chat/components/ChatContainer';

export function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChatContainer />
      </div>
    </div>
  );
}