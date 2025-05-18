'use client';

import Cookies from 'js-cookie';

/**
 * Interface para opções de cookie
 */
export interface CookieOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Classe genérica para manipulação de cookies usando js-cookie
 */
export class CookieManager {
  private static readonly DEFAULT_OPTIONS: CookieOptions = {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  /**
   * Obtém um cookie pelo nome com tipagem
   * @param name Nome do cookie
   * @returns O valor do cookie tipado ou undefined
   */
  static get<T>(name: string): T | undefined {
    if (typeof window === 'undefined') return undefined;

    try {
      const value = Cookies.get(name);
      if (!value) return undefined;

      return JSON.parse(value) as T;
    } catch (e) {
      console.error(`Erro ao obter cookie "${name}":`, e);
      return undefined;
    }
  }

  /**
   * Define um cookie
   * @param name Nome do cookie
   * @param value Valor do cookie (será convertido para JSON)
   * @param options Opções do cookie
   */
  static set<T>(name: string, value: T, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return;

    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    Cookies.set(name, JSON.stringify(value), finalOptions);
  }

  /**
   * Remove um cookie
   * @param name Nome do cookie
   */
  static remove(name: string): void {
    if (typeof window === 'undefined') return;

    Cookies.remove(name);
  }

  /**
   * Verifica se um cookie existe
   * @param name Nome do cookie
   * @returns true se o cookie existe
   */
  static exists(name: string): boolean {
    if (typeof window === 'undefined') return false;

    return Cookies.get(name) !== undefined;
  }

  /**
   * Limpa todos os cookies
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return;

    const cookies = Cookies.get();
    Object.keys(cookies).forEach((name) => Cookies.remove(name));
  }
}

// Exemplo de uso:
// CookieManager.set('user', { id: 1, name: 'John' }, { expires: 7 });
// const userData = CookieManager.get<{ id: number; name: string }>('user');
// CookieManager.remove('user');
