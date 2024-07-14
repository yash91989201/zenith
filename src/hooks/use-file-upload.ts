import axios from 'axios';
import { useState, useCallback } from 'react';
// UTILS
import { env } from '@/env';
// TYPES
import type { AxiosError, AxiosProgressEvent } from 'axios';

type UseFileUploadProps = {
  endpoint: string;
  userId?: string;
}

type UseFileUploadReturn = {
  uploadFile: (file: File) => Promise<{ fileUrl?: string, error?: string }>;
  progress: number;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

type UploadErrorResponse = {
  status: "SUCCESS" | "FAILED";
  message: string;
}

type FileUploadSuccess = {
  status: "SUCCESS";
  fileUrl: string,
  message: string;
}

type FileUploadFailed = {
  status: "FAILED";
  message: string;
}

type FileUploadStatus = FileUploadFailed | FileUploadSuccess

export const useFileUpload = (props: UseFileUploadProps): UseFileUploadReturn => {
  const { endpoint } = props
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<{ fileUrl?: string, error?: string }> => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    props.userId && formData.append("userId", props.userId)

    try {
      const uploadResponse = await axios.post<FileUploadStatus>(`${env.NEXT_PUBLIC_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          if (total) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setProgress(percentCompleted);
          }
        },
      });

      if (uploadResponse.data.status === "SUCCESS") {
        return {
          fileUrl: uploadResponse.data.fileUrl,
        }
      }
      return {
        error: "Unable to upload file, try again1"
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<UploadErrorResponse>;
        setError(axiosError.response?.data.message ?? 'Upload failed');
      } else {
        setError('Upload failed');
      }

      return {
        error: "Unable to upload file, try again2"
      }
    } finally {
      setIsUploading(false);
    }
  }, [endpoint, props.userId]);

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    uploadFile,
    progress,
    isUploading,
    error,
    reset,
  };
};