import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './select';

describe('Select', () => {
    it('renders options and triggers onValueChange', () => {
        const onValueChange = vi.fn();

        render(
            <Select
                value="uva"
                onValueChange={onValueChange}
                options={[
                    { value: 'uva', label: 'UVA' },
                    { value: 'uv1000', label: 'UV1000' },
                ]}
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'uv1000' } });

        expect(onValueChange).toHaveBeenCalledWith('uv1000');
    });

    it('renders placeholder option when provided', () => {
        render(
            <Select
                defaultValue=""
                placeholder="请选择工具"
                options={[{ value: 'uva', label: 'UVA' }]}
            />
        );

        expect(screen.getByRole('option', { name: '请选择工具' })).toBeInTheDocument();
    });

    it('shows helper text and error text with higher priority', () => {
        const { rerender } = render(
            <Select
                value=""
                onValueChange={() => undefined}
                placeholder="请选择工具"
                helperText="先选择一个工具"
                options={[{ value: 'uva', label: 'UVA' }]}
            />
        );

        expect(screen.getByText('先选择一个工具')).toBeInTheDocument();

        rerender(
            <Select
                value=""
                onValueChange={() => undefined}
                placeholder="请选择工具"
                helperText="先选择一个工具"
                errorText="工具是必填项"
                options={[{ value: 'uva', label: 'UVA' }]}
            />
        );

        expect(screen.getByText('工具是必填项')).toBeInTheDocument();
        expect(screen.queryByText('先选择一个工具')).not.toBeInTheDocument();
    });
});
