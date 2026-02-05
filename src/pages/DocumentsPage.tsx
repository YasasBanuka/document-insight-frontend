import { FileText } from 'lucide-react';
import { FileUpload } from '../features/documents/components/FileUpload';
import { DocumentList } from '../features/documents/components/DocumentList';

export function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              My Documents
            </h1>
            <p className="text-sm text-slate-500">Upload and manage your documents</p>
          </div>
        </div>
        <FileUpload />
        <DocumentList />
      </div>
    </div>
  );
}