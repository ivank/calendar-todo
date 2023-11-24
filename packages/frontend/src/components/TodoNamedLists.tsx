import * as React from 'react';
import { useDeleteListsByIdMutation, usePatchListsByIdMutation, usePostListsMutation } from '../store/api.generated';
import { TodoList } from './TodoList';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Disclosure } from '@headlessui/react';
import { NamedList } from '../store/api';

export const TodoNamedLists: React.FC<{ data: NamedList[] }> = ({ data }) => {
  const { named, size } = useSelector((state: RootState) => state.lists);
  const [updateList] = usePatchListsByIdMutation();
  const [deleteList] = useDeleteListsByIdMutation();
  const [addList] = usePostListsMutation();

  const shownLists = data.slice(named.current, named.current + size);

  return (
    <Disclosure defaultOpen={true} as={'section'}>
      <nav className="h-8 flex flex-row justify-center">
        <Disclosure.Button className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Hide
        </Disclosure.Button>
        <button
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() =>
            addList({ body: { title: 'New list', type: 'NAMED', position: data?.length ?? 0, items: [] } })
          }
        >
          Add
        </button>
      </nav>
      <Disclosure.Panel
        as="dl"
        className={classNames('w-full grid grid-cols-1 h-80 gap-px bg-gray-900/5 sm:grid-cols-2', {
          'lg:grid-cols-3': size === 3,
          'lg:grid-cols-5': size === 5,
          'lg:grid-cols-7': size === 7,
        })}
      >
        {shownLists.map((list) => (
          <div key={list.id} className="relative flex flex-col gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <button
              className="absolute top-2 right-2 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => (confirm('Are you sure?') ? deleteList({ id: list.id }) : undefined)}
            >
              x
            </button>
            <input
              className="w-full text-xl font-medium uppercase text-gray-600"
              defaultValue={list.title}
              onChange={({ target: { value } }) => updateList({ id: list.id, body: { ...list, title: value } })}
            />
            <TodoList items={list.items} onChange={(items) => updateList({ id: list.id, body: { ...list, items } })} />
          </div>
        ))}
      </Disclosure.Panel>
    </Disclosure>
  );
};
