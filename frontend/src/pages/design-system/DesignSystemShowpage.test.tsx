import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DesignSystemShowpage from './DesignSystemShowpage';

describe('DesignSystemShowpage', () => {
  it('renders all showpage sections', () => {
    render(<DesignSystemShowpage />);

    expect(screen.getByRole('heading', { name: 'Showpage Review v1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Foundation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Typography' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Motion Lab' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Component States' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Patterns' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Readiness Matrix' })).toBeInTheDocument();
  });

  it('toggles reduced motion simulation and updates samples', () => {
    render(<DesignSystemShowpage />);

    expect(screen.getByTestId('reduced-motion-status')).toHaveTextContent('Reduced motion: Off');
    expect(screen.getByTestId('motion-sample-micro')).toHaveAttribute('data-reduced-motion', 'false');

    fireEvent.click(screen.getByLabelText('Toggle reduced motion'));

    expect(screen.getByTestId('reduced-motion-status')).toHaveTextContent('Reduced motion: On');
    expect(screen.getByTestId('motion-sample-micro')).toHaveAttribute('data-reduced-motion', 'true');
  });

  it('keeps key component states visible for review', () => {
    render(<DesignSystemShowpage />);

    const loadingButton = screen.getByRole('button', { name: /loading/i });
    const disabledButton = screen.getByRole('button', { name: /disabled/i });

    expect(loadingButton).toBeDisabled();
    expect(disabledButton).toBeDisabled();

    const inputDefault = screen.getByLabelText('Input default');
    inputDefault.focus();
    expect(inputDefault).toHaveFocus();

    expect(screen.getByRole('button', { name: 'Trigger toast' })).toBeInTheDocument();
  });
});
