import * as React from 'react';
import { useGetNamedListsQuery, usePatchNamedListsByIdMutation } from '../store/api.generated';
import { TodoList } from './TodoList';

export const TodoNamedLists: React.FC = () => {
  const { data, error, isLoading } = useGetNamedListsQuery({ userId: 1 });
  const [updateList] = usePatchNamedListsByIdMutation();

  return (
    <div>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <ul>
          {data.map((list) => (
            <li key={list.id}>
              <h3>{list.title}</h3>
              <TodoList
                items={list.items}
                onChange={(items) => updateList({ userId: 1, id: list.id, body: { ...list, items } })}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
