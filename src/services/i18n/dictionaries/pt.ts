import { Dictionary } from 'src/types/i18n-types';

const pt: Dictionary = {
  common: {
    companyName: 'Acme Inc.',
    welcome: 'Bem-vindo!',
    increment: 'Incrementar',
    decrement: 'Decrementar',
    signOut: 'SignOut',
    signIn: 'SignIn',
    signUp: 'SignUp',
  },
  home: {
    title: 'Template Next.js',
    description: 'Um template pronto para produção com tecnologias modernas e melhores práticas',
    features: {
      title: 'Recursos',
      items: [
        'Server Components & Server Actions',
        'App Router (Next.js 15)',
        'Modo Claro/Escuro',
        'Internacionalização (i18n)',
        'Autenticação',
        'Design Responsivo',
        'TypeScript',
      ],
    },
    cta: {
      title: 'Pronto para começar seu projeto?',
      description: 'Comece com nosso template e construa aplicações incríveis.',
      button: 'Começar Agora',
    },
  },
  auth: {
    signIn: {
      title: 'Entrar',
      subtitle: 'Faça login para continuar',
      fields: {
        email: {
          label: 'E-mail',
          placeholder: 'Digite seu e-mail',
        },
        password: {
          label: 'Senha',
          placeholder: 'Digite sua senha',
        },
      },
      actions: {
        submit: 'Entrar',
        forgotPassword: 'Esqueceu a senha?',
        noAccount: 'Não tem uma conta?',
        signUp: 'Cadastre-se',
        userNotFound: 'Usuário não encontrado',
        userNotFoundPassword: 'Senha não encontrada entre com Google',
        invalidCredentials: 'Credenciais inválidas',
      },
      footer: {
        orContinueWith: 'Ou continue com',
        google: 'Sign in with Google',
      },
    },
    signUp: {
      title: 'Cadastre-se',
      subtitle: 'Crie sua conta',

      fields: {
        name: {
          label: 'Nome',
          placeholder: 'Digite seu nome',
        },
        lastname: {
          label: 'Sobrenome',
          placeholder: 'Digite seu sobrenome',
        },
        email: {
          label: 'Email',
          placeholder: 'Digite seu email',
        },
        password: {
          label: 'Senha',
          placeholder: 'Digite sua senha',
        },
      },
      actions: {
        submit: 'Cadastrar',
        alreadyHaveAccount: 'Já tem uma conta?',
        signIn: 'Entrar',
        emailAlreadyExists: 'Este e-mail já está cadastrado',
      },
      footer: {
        orContinueWith: 'Ou continue com',
        google: 'Google',
      },
    },
  },
  interface: {
    accountStatus: 'Você está logado em sua conta',
    actions: {
      viewDashboard: 'Ver Painel',
      quickActions: 'Ações Rápidas',
      profile: 'Perfil',
      settings: 'Configurações',
    },
  },
};

export default pt;
