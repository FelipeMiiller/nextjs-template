export type SessionToken = {
  id: string;
  access: Access;
};
export type Session = {
  id: string;
  access: Omit<Access, 'refreshToken'>;
};
export type Access = {
  accessToken: string;
  refreshToken: string;
};
export type User = {
  Email: string;
  Id: string;
  Perfil?: Perfil | null;
  Role: Role;
};

export enum Role {
  Administrador = 'Administrador',
  Gestor = 'Usuario',
}

export interface Perfil {
  Id: string;
  Nome: string;
  Sobrenome: string | null;
  DataNasc: Date | null;
  Telefone: string | null;
  Celular: string | null;
  FotoUrl: string | null;
  UpdatedAt?: Date;
  CreatedAt: Date;
}
