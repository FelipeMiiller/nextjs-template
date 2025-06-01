import { envPrivate } from './env.private';
import { envPublic } from './env.public';

export const routesBackend = {
  auth: {
    google: {
      login: `${envPrivate.backendUrl}/auth/user/google/signin`,
      callback: `${envPublic.appUrl}/api/auth/google/callback`,
    },
    signin: `${envPrivate.backendUrl}/auth/user/signin`,
    signout: `${envPrivate.backendUrl}/auth/user/signout`,
    signup: `${envPrivate.backendUrl}/auth/user/signup`,
    refresh: `${envPrivate.backendUrl}/auth/refresh`,
    forgotPassword: `${envPrivate.backendUrl}/auth/user/forgot-password`,
    me: `${envPrivate.backendUrl}/auth/user/me`,
  },

  users: {
    create: `${envPrivate.backendUrl}/users`,
    getAll: `${envPrivate.backendUrl}/users`,
    getOne: `${envPrivate.backendUrl}/users/:id`,
    update: `${envPrivate.backendUrl}/users/:id`,
    delete: `${envPrivate.backendUrl}/users/:id`,
  },
};
