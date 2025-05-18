export type SignUpFormState =
  | {
      error?: {
        name?: string[];
        lastname?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      status?: number;
    }
  | undefined;

export type SignInFormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      status?: number;
    }
  | undefined;

export type SignInFormValues = {
  email: string;
  password: string;
};
