import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
    it('calls onConfirm and closes when confirm is clicked', () => {
        const onConfirm = vi.fn();
        const onOpenChange = vi.fn();

        render(
            <ConfirmDialog
                open
                onOpenChange={onOpenChange}
                title="删除项目"
                description="确认删除"
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: '确认' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('closes without confirming when cancel is clicked', () => {
        const onConfirm = vi.fn();
        const onOpenChange = vi.fn();

        render(
            <ConfirmDialog
                open
                onOpenChange={onOpenChange}
                title="删除项目"
                description="确认删除"
                onConfirm={onConfirm}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: '取消' }));

        expect(onConfirm).not.toHaveBeenCalled();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
