export type Payload = {
  email: string;
  sub: string;
  role: Roles;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  Email: string;
  Id: string;
  Perfil?: Perfil | null;
  Role: Roles;
};

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export type Perfil = {
  Id: string;
  Nome: string;
  Sobrenome: string | null;
  DataNasc: Date | null;
  Telefone: string | null;
  Celular: string | null;
  FotoUrl: string | null;
  UpdatedAt?: Date;
  CreatedAt: Date;
};
