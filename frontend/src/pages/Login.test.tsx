import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from './Login';

const loginMock = vi.fn();
const registerMock = vi.fn();
const loginContextMock = vi.fn();

vi.mock('@/services/auth', () => ({
    authService: {
        login: (...args: unknown[]) => loginMock(...args),
        register: (...args: unknown[]) => registerMock(...args),
    },
}));

vi.mock('@/contexts/useAuth', () => ({
    useAuth: () => ({
        login: (...args: unknown[]) => loginContextMock(...args),
        isAuthenticated: false,
    }),
}));

describe('Login page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('switches between login and register modes', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: '去注册' }));

        expect(screen.getByRole('button', { name: '注册并登录' })).toBeInTheDocument();
    });
});
