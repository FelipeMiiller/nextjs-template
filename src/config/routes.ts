import { env } from './env';

export const routesBackend = {
  auth: {
    google: {
      login: `${env.backendUrl}/auth/user/google/signin`,
      callback: `${env.appUrl}/api/auth/google/callback`,
    },
    signin: `${env.backendUrl}/auth/user/signin`,
    signout: `${env.backendUrl}/auth/user/signout`,
    signup: `${env.backendUrl}/auth/user/signup`,
    refresh: `${env.backendUrl}/auth/refresh`,
    forgotPassword: `${env.backendUrl}/auth/user/forgot-password`,
    me: `${env.backendUrl}/auth/user/me`,
  },

  users: {
    create: `${env.backendUrl}/users`,
    getAll: `${env.backendUrl}/users`,
    getOne: `${env.backendUrl}/users/:id`,
    update: `${env.backendUrl}/users/:id`,
    delete: `${env.backendUrl}/users/:id`,
  },
};
