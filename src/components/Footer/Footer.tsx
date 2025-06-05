import classNames from 'classnames';
import React from 'react';
import { TodosFilter } from '../../types/TodosFilter';

type Props = {
  completedTodosCount: number;
  todosFilter: TodosFilter;
  setTodosFilter: React.Dispatch<React.SetStateAction<TodosFilter>>;
};

export const Footer: React.FC<Props> = ({
  completedTodosCount,
  todosFilter,
  setTodosFilter,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {completedTodosCount} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: todosFilter === 'All',
        })}
        data-cy="FilterLinkAll"
        onClick={() => setTodosFilter('All')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: todosFilter === 'Active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => setTodosFilter('Active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: todosFilter === 'Completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setTodosFilter('Completed')}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
    >
      Clear completed
    </button>
  </footer>
);
