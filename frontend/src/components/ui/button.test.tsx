import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('disables and announces busy state when loading', () => {
    render(
      <Button isLoading loadingText="正在提交">
        提交
      </Button>
    );

    const button = screen.getByRole('button', { name: '正在提交' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('prevents click callbacks while loading', () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        提交
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
