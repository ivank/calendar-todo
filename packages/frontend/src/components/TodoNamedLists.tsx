import * as React from "react";
import {
  useDeleteListsByIdMutation,
  usePatchListsByIdMutation,
  usePostListsMutation,
} from "../store/api.generated";
import { TodoList } from "./TodoList";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Transition } from "@headlessui/react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import {
  ChevronDoubleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import spinnerSvg from "../assets/spinner.svg";
import { NamedList } from "../store/api";
import { setNamedCurrent, setNamedShown } from "../store/lists.slice";

export const TodoNamedLists: React.FC<{ data: NamedList[] }> = ({ data }) => {
  const dispatch = useDispatch();
  const { named, namedShown } = useSelector((state: RootState) => state.lists);
  const [updateList] = usePatchListsByIdMutation();
  const [deleteList, deleteListStatus] = useDeleteListsByIdMutation();
  const [addList, addListStatus] = usePostListsMutation();

  const onClickAddNewList = () =>
    addList({ body: { title: "New list", type: "NAMED", items: [] } });

  const nextNamed = setNamedCurrent(Math.min(data.length, named.current + 1));
  const prevNamed = setNamedCurrent(Math.max(0, named.current - 1));
  const toggleNamedShown = setNamedShown(!namedShown);

  return (
    <section>
      <nav
        className={classNames(
          "flex h-10 flex-row justify-center gap-1 bg-gradient-to-t py-1",
          { "from-gray-900/5": namedShown },
          { "from-gray-900/0": !namedShown },
        )}
      >
        <button
          className="btn-sm"
          disabled={named.current <= 0}
          onClick={() => dispatch(prevNamed)}
        >
          <ChevronLeftIcon className=" h-4" />
        </button>
        <button className="btn-sm">
          <ChevronDoubleUpIcon
            className={classNames("h-4 w-8", { "rotate-180": namedShown })}
            onClick={() => dispatch(toggleNamedShown)}
          />
        </button>
        <button
          className="btn-sm"
          disabled={named.current >= data.length}
          onClick={() => dispatch(nextNamed)}
        >
          <ChevronRightIcon className=" h-4" />
        </button>
      </nav>
      <Transition
        show={namedShown}
        className="overflow-hidden bg-gray-900/5"
        enter="transition ease-out duration-100 origin-bottom"
        enterFrom="transform translate-y-full"
        enterTo="transform translate-y-0"
        leave="transition ease-in duration-100 origin-bottom"
        leaveFrom="transform translate-y-0"
        leaveTo="transform translate-y-full"
      >
        <dl
          className={classNames(
            "left-[calc(-1*(100%/(1))*var(--named-current))] w-[calc((100%/(1))*max((1),var(--named-size)+1))]",
            "sm:left-[calc(-1*(100%/(2))*var(--named-current))] sm:w-[calc((100%/(2))*max((2),var(--named-size)+1))]",
            "md:left-[calc(-1*(100%/(3))*var(--named-current))] md:w-[calc((100%/(3))*max((3),var(--named-size)+1))]",
            "lg:left-[calc(-1*(100%/var(--size))*var(--named-current))] lg:w-[calc((100%/var(--size))*max(var(--size),var(--named-size)+1))]",
            "min-h-72 relative flex flex-row transition-all duration-200 ease-out",
          )}
        >
          {data.map((list) => (
            <div
              key={list.id}
              className={classNames(
                "w-[calc(100%/(1))]",
                "sm:w-[calc(100%/(2))]",
                "md:w-[calc(100%/(3))]",
                "lg:w-[calc(100%/var(--size))]",
                "relative flex flex-col bg-white px-4 py-10 sm:px-6 xl:px-8",
              )}
            >
              <button
                className="absolute right-2 top-2 rounded bg-white px-2 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() =>
                  confirm("Are you sure?")
                    ? deleteList({ id: list.id })
                    : undefined
                }
              >
                {deleteListStatus.isLoading &&
                deleteListStatus.originalArgs.id === list.id ? (
                  <img
                    src={spinnerSvg}
                    className="inline h-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <XMarkIcon className="h-4" />
                )}
              </button>
              <input
                className="w-full text-xl font-medium uppercase text-gray-600"
                defaultValue={list.title}
                onChange={({ target: { value } }) =>
                  updateList({ id: list.id, body: { ...list, title: value } })
                }
              />
              <TodoList
                items={list.items}
                onChange={(items) =>
                  updateList({ id: list.id, body: { ...list, items } })
                }
              />
            </div>
          ))}
          <div
            className={classNames(
              "w-[calc(100%/(1))]",
              "sm:w-[calc(100%/(2))]",
              "md:w-[calc(100%/(3))]",
              "lg:w-[calc(100%/var(--size))]",
              "relative flex flex-col px-4 py-10 sm:px-6 xl:px-8",
            )}
          >
            <button
              type="button"
              className="block h-72 w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => onClickAddNewList()}
            >
              <FolderPlusIcon className="mx-auto h-12 w-12 text-gray-400" />

              <span className="mt-2 block text-sm font-semibold text-gray-900">
                {addListStatus.isLoading ? (
                  <img
                    src={spinnerSvg}
                    className="inline h-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  "Add list"
                )}
              </span>
            </button>
          </div>
        </dl>
      </Transition>
    </section>
  );
};
