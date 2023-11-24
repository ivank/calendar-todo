import * as React from 'react';
import { useDeleteListsByIdMutation, usePatchListsByIdMutation, usePostListsMutation } from '../store/api.generated';
import { TodoList } from './TodoList';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Disclosure, Transition } from '@headlessui/react';
import { FolderPlusIcon } from '@heroicons/react/24/outline';
import { ChevronDoubleUpIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { NamedList } from '../store/api';

export const TodoNamedLists: React.FC<{ data: NamedList[] }> = ({ data }) => {
  const { named, size } = useSelector((state: RootState) => state.lists);
  const [updateList] = usePatchListsByIdMutation();
  const [deleteList] = useDeleteListsByIdMutation();
  const [addList] = usePostListsMutation();

  const onClickAddNewList = () =>
    addList({ body: { title: 'New list', type: 'NAMED', position: data?.length ?? 0, items: [] } });

  const shownLists = data.slice(named.current, named.current + size);

  return (
    <Disclosure defaultOpen={true} as={'section'}>
      {({ open }) => (
        <>
          <nav
            className={classNames(
              'h-8 flex flex-row justify-center bg-gradient-to-t',
              { 'from-gray-900/5': open },
              { 'from-gray-900/0': !open },
            )}
          >
            <Disclosure.Button className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <ChevronDoubleUpIcon className={classNames('h-4 w-8', { 'rotate-180': open })} />
            </Disclosure.Button>
          </nav>
          <Transition
            enter="transition ease-out duration-50 origin-bottom"
            enterFrom="transform translate-y-full"
            enterTo="transform translate-y-0"
            leave="transition ease-in duration-100 origin-bottom"
            leaveFrom="transform translate-y-0"
            leaveTo="transform translate-y-full"
          >
            <Disclosure.Panel
              as="dl"
              className={classNames('w-full grid grid-cols-1 h-80 gap-px bg-gray-900/5 sm:grid-cols-2', {
                'lg:grid-cols-3': size === 3,
                'lg:grid-cols-5': size === 5,
                'lg:grid-cols-7': size === 7,
              })}
            >
              {shownLists.map((list) => (
                <div
                  key={list.id}
                  className="relative flex flex-col gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
                >
                  <button
                    className="absolute top-2 right-2 rounded bg-white px-2 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => (confirm('Are you sure?') ? deleteList({ id: list.id }) : undefined)}
                  >
                    <XMarkIcon className="h-4" />
                  </button>
                  <input
                    className="w-full text-xl font-medium uppercase text-gray-600"
                    defaultValue={list.title}
                    onChange={({ target: { value } }) => updateList({ id: list.id, body: { ...list, title: value } })}
                  />
                  <TodoList
                    items={list.items}
                    onChange={(items) => updateList({ id: list.id, body: { ...list, items } })}
                  />
                </div>
              ))}
              {shownLists.length < size && (
                <div className="relative flex flex-col gap-x-4 gap-y-2 px-4 py-10 sm:px-6 xl:px-8">
                  <button
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => onClickAddNewList()}
                  >
                    <FolderPlusIcon className="mx-auto h-12 w-12 text-gray-400" />

                    <span className="mt-2 block text-sm font-semibold text-gray-900">Add new List</span>
                  </button>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
