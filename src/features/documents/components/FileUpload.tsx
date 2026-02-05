import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, File, Loader2 } from 'lucide-react';
import { documentApi } from '../api/documentApi';
import type { UploadResponse } from '../../../types/api.types';

export function FileUpload() {
  const queryClient = useQueryClient();
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => documentApi.upload(file),
    onSuccess: (data: UploadResponse) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setLastUploadedFile(data.filename);

      // Success toast
      toast.success(
        `${data.filename} uploaded successfully!`,
        {
          duration: 5000,
        }
      );
    },
    onError: (error: Error) => {
      // Improved error messages
      let errorMessage = 'Upload failed';

      if (error.message.includes('size')) {
        errorMessage = 'File too large. Maximum size is 10MB. Try compressing your file.';
      } else if (error.message.includes('type')) {
        errorMessage = 'Invalid file type. Only PDF, DOCX, and TXT files are supported.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }

      toast.error(errorMessage, {
        duration: 6000,
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];

      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error('File too large. Maximum size is 10MB.', {
          duration: 5000,
        });
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Only PDF, DOCX, and TXT files are supported.', {
          duration: 5000,
        });
      } else {
        toast.error('Cannot upload this file. Please try another one.', {
          duration: 5000,
        });
      }
      return;
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Validation toast
      toast.loading(`Uploading ${file.name}...`, {
        id: 'upload-progress',
      });

      uploadMutation.mutate(file, {
        onSettled: () => {
          toast.dismiss('upload-progress');
        },
      });
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
            ? 'border-primary-500 bg-primary-50 scale-[1.02]'
            : 'border-slate-300 hover:border-slate-400 bg-white hover:shadow-md'
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
              <p className="text-sm text-slate-500 mt-1">This may take a moment</p>
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
        </div>
      </div>
    </div>
  );
}