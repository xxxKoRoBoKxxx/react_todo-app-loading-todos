/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { getTodos, USER_ID } from './api/todos';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const allTodos: Todo[] = [];

  console.log('Initial todos:', [...allTodos]);

  getTodos().then(todosFromServer => {
    todosFromServer.forEach(todo => allTodos.push(todo));
    // allTodos = [...todosFromServer];

    console.log('Todos from server:', [...allTodos]);
  });

  console.log('New todos:', [...allTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList todos={allTodos} />

        {/* Hide the footer if there are no todos */}
        {allTodos.length > 0 && <Footer />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification />
    </div>
  );
};
