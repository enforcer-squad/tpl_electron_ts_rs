import { useState } from 'react';
import TodoItem from '@renderer/components/todoItem';
import { useTodos } from '@renderer/store/selectors';
import { reactiveMemo } from '@enforcer-squad/rex';

const TodoList = () => {
  const [state, setState] = useState(1);

  const todos = useTodos();
  console.log('TodoList render');

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <div>
        <span>{state}</span>
        <button onClick={() => setState(c => c + 1)}>add</button>
      </div>
    </div>
  );
};

export default reactiveMemo(TodoList);
