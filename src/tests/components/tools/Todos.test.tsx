import { render, screen, fireEvent } from '@testing-library/react';
import { Todos } from '@/components/tools/Todos';
import { describe, it, expect } from 'vitest';

describe('Todos', () => {
  it('renders correctly', () => {
    render(<Todos />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });

  it('allows adding a new todo', () => {
    render(<Todos />);
    const input = screen.getByPlaceholderText('Enter a todo');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add Todo'));
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('allows removing a todo', () => {
    render(<Todos />);
    const input = screen.getByPlaceholderText('Enter a todo');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add Todo'));
    fireEvent.click(screen.getByText('Remove'));
    expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
  });
});
