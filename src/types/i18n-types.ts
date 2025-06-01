// Common translations
interface CommonTranslations {
  companyName: string;
  welcome: string;
  increment: string;
  decrement: string;
  signOut: string;
  signIn: string;
  signUp: string;
}

interface HomeTranslations {
  title: string;
  description: string;

  features: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

// Interface translations
interface InterfaceTranslations {
  accountStatus: string;
  actions: {
    viewDashboard: string;
    quickActions: string;
    profile: string;
    settings: string;
  };
}

// Auth translations
export interface AuthTranslations {
  signIn: {
    title: string;
    subtitle: string;
    google?: string;
    orContinueWith?: string;
    fields: {
      email: {
        label: string;
        placeholder: string;
      };
      password: {
        label: string;
        placeholder: string;
      };
    };
    actions: {
      submit: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
      orContinueWith?: string;
      userNotFound: string;
      userNotFoundPassword: string;
      invalidCredentials: string;
    };
    footer: {
      orContinueWith?: string;
      google?: string;
    };
  };
  signUp: {
    title: string;
    subtitle: string;
    orContinueWith?: string;
    google?: string;
    fields: {
      name: {
        label: string;
        placeholder: string;
      };
      lastname: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      password: {
        label: string;
        placeholder: string;
      };
    };
    actions: {
      submit: string;
      alreadyHaveAccount: string;
      signIn: string;
      emailAlreadyExists: string;
    };
    footer: {
      orContinueWith: string;
      google: string;
    };
  };
}

// Main dictionary type
export interface Dictionary {
  common: CommonTranslations;
  home: HomeTranslations;
  auth: AuthTranslations;
  interface: InterfaceTranslations;
}

// Language-specific dictionaries
export type Locale = 'en' | 'pt';

export const locales = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
] as const;
