import { toast } from 'react-toastify';

export const toastSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: "linear-gradient(to right, #22c55e, #16a34a)",
      color: "white",
      borderRadius: "1rem",
    }
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    style: {
      background: "linear-gradient(to right, #ef4444, #dc2626)",
      color: "white",
      borderRadius: "1rem",
    }
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    style: {
      background: "linear-gradient(to right, #0ea5e9, #0284c7)",
      color: "white",
      borderRadius: "1rem",
    }
  });
};

export const toastWarning = (message: string) => {
  toast.warning(message, {
    style: {
      background: "linear-gradient(to right, #f59e0b, #d97706)",
      color: "white",
      borderRadius: "1rem",
    }
  });
}; 