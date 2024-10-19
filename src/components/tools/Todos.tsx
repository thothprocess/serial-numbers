import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

interface TodoItemProps {
  todo: string;
  onRemove: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onRemove }) => {
  return (
    <div className="todo-item">
      <span>{todo}</span>{' '}
      <Button variant="outline" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
};

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };

  const removeTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div>
      <PageHeader title="Todos" />
      <Input
        className="my-2"
        type="text"
        placeholder="Enter a todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button className="w-full" onClick={addTodo}>
        Add Todo
      </Button>

      <div className="my-2">
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            todo={todo}
            onRemove={() => removeTodo(index)}
          />
        ))}
      </div>
    </div>
  );
};
