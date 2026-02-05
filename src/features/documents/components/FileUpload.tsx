import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { documentApi } from '../api/documentApi';

export function FileUpload() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadMutation.mutate(acceptedFiles[0]);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-white'
          }
          ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {uploadMutation.isPending ? (
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            ) : (
              <div className="p-3 bg-primary-50 rounded-lg">
                <Upload className="w-12 h-12 text-primary-600" />
              </div>
            )}
          </div>
          
          {uploadMutation.isPending ? (
            <div>
              <p className="text-slate-700 font-medium">Uploading document...</p>
              <p className="text-sm text-slate-500 mt-1">Please wait</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-medium text-slate-900">
                  {isDragActive ? 'Drop file here' : 'Upload Document'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Drag and drop or click to browse
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <File className="w-3 h-3" />
                <span>Supports PDF, DOCX, TXT • Max 10MB</span>
              </div>
            </>
          )}
          
          {uploadMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-900">Upload failed</p>
                <p className="text-xs text-red-700 mt-1">{uploadMutation.error.message}</p>
              </div>
            </div>
          )}
          
          {uploadMutation.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-900">Upload successful</p>
                <p className="text-xs text-green-700 mt-1">{uploadMutation.data.filename}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}