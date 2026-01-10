import { useCallback } from 'react';
import { useAppDispatch } from '@/lib/store';
import { showAlert, hideAlert, AlertVariant } from '@/lib/features/alertSlice';

interface AlertOptions {
  title?: string;
  message?: string;
  variant?: AlertVariant;
}

export function useAlert() {
  const dispatch = useAppDispatch();

  const openAlert = useCallback(
    (options: AlertOptions) => {
      dispatch(showAlert(options));
    },
    [dispatch],
  );

  const closeAlert = useCallback(() => {
    dispatch(hideAlert());
  }, [dispatch]);

  const showInfo = useCallback(
    (message: string, title?: string) => {
      dispatch(showAlert({ title, message, variant: 'info' }));
    },
    [dispatch],
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      dispatch(showAlert({ title, message, variant: 'success' }));
    },
    [dispatch],
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      dispatch(showAlert({ title, message, variant: 'warning' }));
    },
    [dispatch],
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      dispatch(showAlert({ title, message, variant: 'error' }));
    },
    [dispatch],
  );

  return {
    openAlert,
    closeAlert,
    showInfo,
    showSuccess,
    showWarning,
    showError,
  };
}
