import { SearchContainer } from '../features/documents/components/SearchContainer';

export function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <SearchContainer />
      </div>
    </div>
  );
}