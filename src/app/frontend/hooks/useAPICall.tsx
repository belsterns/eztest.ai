'use client';

import { useState } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { useAlertManager } from './useAlertManager';


interface ApiCallParams {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  isShowAlert?: boolean;
  setIsLoading?:
    | Dispatch<SetStateAction<Record<string, boolean>>>
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<any>>;
  loader?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface UseApiReturn {
  error: string | null;
  success: string | null;
  apiMethod: string | null;
  makeApiCall: <T = any>(params: ApiCallParams) => Promise<ApiResponse<T>>;
}

export const useApi = (): UseApiReturn => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiMethod, setApiMethod] = useState<string | null>(null);

  const showAlert = useAlertManager();

  const makeApiCall = async ({
    url,
    method,
    body,
    isShowAlert,
    headers,
    setIsLoading,
    loader
  }: ApiCallParams) => {
    setError(null);

    try {
      setError(null);
      setSuccess(null);
      if (setIsLoading && loader) {
        setIsLoading((prev: Record<string, boolean>) => ({
          ...prev,
          [loader]: true
        }));
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const result = await response.json();
      setApiMethod(method);
      if (!response.ok) {
        setError(result.message || 'Something went wrong');
        if (isShowAlert) {
          showAlert(result.message, true);
        }
        return undefined;
      }

      if (method !== 'GET' && isShowAlert) {
        showAlert(result.message, false);
      }

      setSuccess(result.message || 'Request successful');
      return result;
    } catch (err: any) {
      if (isShowAlert) {
        showAlert(err.message, true);
      }
      setError(err.message || 'An unknown error occurred');
      return undefined;
    } finally {
      if (setIsLoading && loader) {
        setIsLoading((prev: Record<string, boolean>) => ({
          ...prev,
          [loader]: false
        }));
      }
    }
  };

  return { success, error, apiMethod, makeApiCall };
};
