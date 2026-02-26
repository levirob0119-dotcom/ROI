import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import Login from './Login';

vi.mock('@/contexts/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: false,
    }),
}));

describe('Login page', () => {
    it('shows SSO redirect spinner when not authenticated', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByText('正在跳转到 SSO 登录…')).toBeInTheDocument();
    });
});
