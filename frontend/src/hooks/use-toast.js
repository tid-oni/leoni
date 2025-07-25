import { useState, useCallback } from 'react';

const toasts = [];
const listeners = [];

const addToast = (toast) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { ...toast, id };
  toasts.push(newToast);
  
  listeners.forEach(listener => listener([...toasts]));
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
  
  return id;
};

const removeToast = (id) => {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(listener => listener([...toasts]));
  }
};

export const useToast = () => {
  const [toastList, setToastList] = useState([...toasts]);

  const subscribe = useCallback((listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const toast = useCallback((options) => {
    return addToast(options);
  }, []);

  const dismiss = useCallback((id) => {
    removeToast(id);
  }, []);

  // Subscribe to toast updates
  React.useEffect(() => {
    return subscribe(setToastList);
  }, [subscribe]);

  return {
    toast,
    dismiss,
    toasts: toastList,
  };
};