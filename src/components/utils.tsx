import { toast } from "sonner";

export const handleValidationZodToast = (error: Record<string, unknown>) => {
    Object.values(error).forEach((errors) => {
      if (Array.isArray(errors)) {
        errors.forEach((error) => toast.error(error));
      }
    });
  };