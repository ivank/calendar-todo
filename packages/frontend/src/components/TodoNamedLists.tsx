import * as React from 'react';
import { useDeleteListsByIdMutation, usePatchListsByIdMutation, usePostListsMutation } from '../store/api.generated';
import { TodoList } from './TodoList';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';
import { FolderPlusIcon } from '@heroicons/react/24/outline';
import { ChevronDoubleUpIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import spinnerSvg from '../assets/spinner.svg';
import { NamedList } from '../store/api';
import { setNamedCurrent, setNamedShown } from '../store/lists.slice';

export const TodoNamedLists: React.FC<{ data: NamedList[] }> = ({ data }) => {
  const dispatch = useDispatch();
  const { named, size, namedShown } = useSelector((state: RootState) => state.lists);
  const [updateList] = usePatchListsByIdMutation();
  const [deleteList, deleteListStatus] = useDeleteListsByIdMutation();
  const [addList, addListStatus] = usePostListsMutation();

  const onClickAddNewList = () => addList({ body: { title: 'New list', type: 'NAMED', items: [] } });

  const shownLists = data.slice(named.current, named.current + size);
  const nextNamed = setNamedCurrent(Math.min(data.length, named.current + 1));
  const prevNamed = setNamedCurrent(Math.max(1, named.current - 1));
  const toggleNamedShown = setNamedShown(!namedShown);

  return (
    <section>
      <nav
        className={classNames(
          'h-10 py-1 flex flex-row justify-center gap-1 bg-gradient-to-t',
          { 'from-gray-900/5': namedShown },
          { 'from-gray-900/0': !namedShown },
        )}
      >
        <button className="btn-sm" disabled={named.current <= 1} onClick={() => dispatch(prevNamed)}>
          <ChevronLeftIcon className=" h-4" />
        </button>
        <button className="btn-sm">
          <ChevronDoubleUpIcon
            className={classNames('h-4 w-8', { 'rotate-180': namedShown })}
            onClick={() => dispatch(toggleNamedShown)}
          />
        </button>
        <button className="btn-sm" disabled={named.current >= data.length} onClick={() => dispatch(nextNamed)}>
          <ChevronRightIcon className=" h-4" />
        </button>
      </nav>
      <Transition
        show={namedShown}
        enter="transition ease-out duration-100 origin-bottom"
        enterFrom="transform translate-y-full"
        enterTo="transform translate-y-0"
        leave="transition ease-in duration-100 origin-bottom"
        leaveFrom="transform translate-y-0"
        leaveTo="transform translate-y-full"
      >
        <dl
          className={classNames('w-full grid grid-cols-1 h-80 gap-px bg-gray-900/5 sm:grid-cols-2', {
            'lg:grid-cols-3': size === 3,
            'lg:grid-cols-5': size === 5,
            'lg:grid-cols-7': size === 7,
          })}
        >
          {shownLists.map((list) => (
            <div key={list.id} className="relative flex flex-col gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
              <button
                className="absolute top-2 right-2 rounded bg-white px-2 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => (confirm('Are you sure?') ? deleteList({ id: list.id }) : undefined)}
              >
                {deleteListStatus.isLoading ? (
                  <img src={spinnerSvg} className="inline h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <XMarkIcon className="h-4" />
                )}
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

                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  {addListStatus.isLoading ? (
                    <img src={spinnerSvg} className="inline h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    'Add list'
                  )}
                </span>
              </button>
            </div>
          )}
        </dl>
      </Transition>
    </section>
  );
};
