/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from 'src/app/page';

describe('HomePage', () => {
  it('deve renderizar o container principal', () => {
    render(<HomePage />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('deve exibir o título de boas-vindas', () => {
    render(<HomePage />);
    expect(screen.getByTestId('title')).toHaveTextContent(/bem-vindo/i);
  });

  it('deve exibir o subtítulo de instrução', () => {
    render(<HomePage />);
    expect(screen.getByTestId('subtitle')).toHaveTextContent(/faça login para continuar/i);
  });

  it('deve renderizar o formulário de login', () => {
    render(<HomePage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('github-button')).toBeInTheDocument();
  });

  it('deve renderizar o ReactLogo', () => {
    render(<HomePage />);
    // O ReactLogo está dentro do span com data-testid="react-logo"
    expect(screen.getByTestId('react-logo')).toBeInTheDocument();
  });
});
