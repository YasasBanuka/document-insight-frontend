import { Link, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, Search, Home } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(path)
      ? 'bg-gradient-primary text-white shadow-sm'
      : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" showIcon={true} />

          <div className="flex gap-2">
            <Link to="/" className={linkClass('/')}>
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/documents" className={linkClass('/documents')}>
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </Link>
            <Link to="/chat" className={linkClass('/chat')}>
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Link>
            <Link to="/search" className={linkClass('/search')}>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}