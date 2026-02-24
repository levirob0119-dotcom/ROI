import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

describe('Table', () => {
    it('renders semantic table structure', () => {
        render(
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>列 A</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>值 A1</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: '列 A' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '值 A1' })).toBeInTheDocument();
    });
});
