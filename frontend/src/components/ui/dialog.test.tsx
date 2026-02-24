import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect } from 'vitest';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

function DialogHarness() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>Dialog Description</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

describe('Dialog', () => {
    it('renders content when open', () => {
        render(<DialogHarness />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    it('closes on Escape key', () => {
        render(<DialogHarness />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on overlay click by default', () => {
        render(<DialogHarness />);
        const dialog = screen.getByRole('dialog');
        const overlay = dialog.parentElement;
        expect(overlay).not.toBeNull();
        fireEvent.mouseDown(overlay as HTMLElement);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
