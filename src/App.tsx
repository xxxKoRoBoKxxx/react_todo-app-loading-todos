/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getTodos, USER_ID } from './api/todos';
import { wait } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilter';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todos } from './components/Todos/Todos';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [queuedTodos, setQueuedTodos] = useState<Todo[]>([]);
  const [todosFilter, setTodosFilter] = useState<TodosFilter>('All');

  const [error, setError] = useState('');

  const todosFromServer = useRef<Todo[]>([]);
  const [completedTodosCount, setCompletedTodosCount] = useState<number>(0);

  const countCompletedTodos = useCallback<() => void>(() => {
    setCompletedTodosCount(
      todosFromServer.current.filter(todo => !todo.completed).length,
    );
  }, []);

  const updateTodosFromServer = useCallback(() => {
    getTodos()
      .then(todosRecieved => {
        todosFromServer.current = [...todosRecieved];
        setQueuedTodos([...todosRecieved]);
        countCompletedTodos();
      })
      .catch(() => {
        setError('Unable to load todos');
        wait(3000).then(() => setError(''));
      });
  }, [countCompletedTodos]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateTodosFromServer, []);

  useEffect(() => {
    let newTodos: Todo[] = [];
    const allTodos = [...todosFromServer.current];

    if (todosFilter === 'Active') {
      newTodos = allTodos.filter(todo => !todo.completed);
    } else if (todosFilter === 'Completed') {
      newTodos = allTodos.filter(todo => todo.completed);
    } else {
      newTodos = allTodos;
    }

    setQueuedTodos(newTodos);
  }, [todosFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          {queuedTodos.length > 0 && <Todos todos={queuedTodos} />}
          {false && (
            <>
              {/* This is a completed todo */}
              <div data-cy="Todo" className="todo completed">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  Completed Todo
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>

              {/* This todo is an active todo */}
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  Not Completed Todo
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>

              {/* This todo is being edited */}
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                {/* This form is shown instead of the title and remove button */}
                <form>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value="Todo is being edited now"
                  />
                </form>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>

              {/* This todo is in loadind state */}
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  Todo is being saved now
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                {/* 'is-active' class puts this modal on top of the todo */}
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todosFromServer.current.length > 0 && (
          <Footer
            completedTodosCount={completedTodosCount}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
