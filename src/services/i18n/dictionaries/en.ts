import { Dictionary } from 'src/types/i18n-types';

const en: Dictionary = {
  common: {
    companyName: 'Acme Inc.',
    welcome: 'Welcome!',
    increment: 'Increment',
    decrement: 'Decrement',
    signOut: 'SignOut',
    signIn: 'SignIn',
    signUp: 'SignUp',
  },
  home: {
    title: 'Next.js Template',
    description: 'A production-ready template with modern technologies and best practices',

    features: {
      title: 'Features',
      items: [
        'Server Components & Server Actions',
        'App Router (Next.js 15)',
        'Internationalization (i18n)',
        'Authentication',
        'Responsive Design',
        'TypeScript',
      ],
    },
    cta: {
      title: 'Ready to start your project?',
      description: 'Get started with our template and build amazing applications.',
      button: 'Get Started',
    },
  },
  auth: {
    signIn: {
      title: 'Sign In',
      subtitle: 'Sign in to continue',
      fields: {
        email: {
          label: 'Email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          placeholder: 'Enter your password',
        },
      },
      actions: {
        submit: 'Sign In',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        userNotFound: 'User not found',
        userNotFoundPassword: 'Password not found sign in with Google',
        invalidCredentials: 'Invalid credentials',
      },
      footer: {
        orContinueWith: 'Or continue with',
        google: 'Login with Google',
      },
    },
    signUp: {
      title: 'Sign Up',
      subtitle: 'Create your account',
      orContinueWith: 'Or continue with',
      fields: {
        name: {
          label: 'Name',
          placeholder: 'Enter your name',
        },
        lastname: {
          label: 'Last Name',
          placeholder: 'Enter your last name',
        },
        email: {
          label: 'Email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          placeholder: 'Enter your password',
        },
      },
      actions: {
        submit: 'Sign Up',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign in',
        emailAlreadyExists: 'This email is already registered',
      },
      footer: {
        orContinueWith: 'Or continue with',
        google: 'Google',
      },
    },
  },
  interface: {
    accountStatus: 'You are now logged in to your account',
    actions: {
      viewDashboard: 'View Dashboard',
      quickActions: 'Quick Actions',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
};

export default en;
