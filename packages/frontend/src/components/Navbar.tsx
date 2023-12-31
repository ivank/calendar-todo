import { useAppDispatch, useAppSelector } from '../store/store';
import { setDayCurrent, setWindowSize } from '../store/ui.slice';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import faviconSvg from '../assets/favicon.svg';
import { clearUser } from '../store/auth.slice';
import {
  CodeBracketSquareIcon,
  UserCircleIcon as UserCircleOutline,
  DocumentTextIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import {
  UserCircleIcon as UserCircleSolid,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import { clearAll, toChangesLists } from '../store/db.slice';
import { usePostListsMutation } from '../store/api.generated';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const { day, size } = useAppSelector((state) => state.ui);
  const { changes } = useAppSelector((state) => state.db);
  const user = useAppSelector((state) => state.auth.user);
  const [, postQuery] = usePostListsMutation({ fixedCacheKey: 'sync' });

  const nextScreen = setDayCurrent(day.current + size);
  const nextDay = setDayCurrent(day.current + 1);
  const prevDay = setDayCurrent(day.current - 1);
  const prevScreen = setDayCurrent(day.current - size);

  const hasChanges = toChangesLists(changes).length > 0;

  const logOut = () => {
    dispatch(clearUser());
    dispatch(clearAll());
  };

  return (
    <nav className="bg-darkpurple-400">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-1">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="hidden h-10 sm:block" src={logoSvg} alt="Calendar Todo" />
              <img className="h-10 sm:hidden" src={faviconSvg} alt="Calendar Todo" />
            </Link>
          </div>
          <div className="w-6 rounded-md px-2 py-1 text-sm font-medium text-gray-300">
            {postQuery.isLoading ? (
              <DocumentArrowUpIcon className="h-6" title="Saving in progress" />
            ) : hasChanges ? (
              <DocumentTextIcon className="h-6 opacity-50" title="Unsaved changes" />
            ) : null}
          </div>
          {user && (
            <>
              <div className="flex flex-grow items-center justify-center">
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => dispatch(prevScreen)}
                >
                  <ChevronDoubleLeftIcon className="h-4" />
                </button>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => dispatch(prevDay)}
                >
                  <ChevronLeftIcon className="h-4" />
                </button>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => dispatch(nextDay)}
                >
                  <ChevronRightIcon className="h-4" />
                </button>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => dispatch(nextScreen)}
                >
                  <ChevronDoubleRightIcon className="h-4" />
                </button>
              </div>
              <select
                className="form-select hidden w-16 flex-shrink rounded-md border-0 bg-transparent py-1 pl-3 pr-10 text-gray-300  ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-atomictangerine-400 lg:block"
                value={size}
                onChange={({ target: { value } }) => dispatch(setWindowSize(Number(value)))}
              >
                {[3, 5, 7].map((item) => (
                  <option value={item} key={item}>
                    {item} Columns
                  </option>
                ))}
              </select>
              <a
                className="rounded-md px-2 py-1 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                title="Source Code at GitHub"
                href="https://github.com/ivank/calendar-todo"
              >
                <CodeBracketSquareIcon className="h-8" />
              </a>
            </>
          )}
          <Menu as="div" className="relative flex-shrink">
            <div>
              <Menu.Button className="relative flex max-w-xs items-center rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {user ? (
                  <UserCircleSolid className="h-8 rounded-full text-white" />
                ) : (
                  <UserCircleOutline className="h-8 rounded-full text-white" />
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {user ? (
                  <Menu.Item>
                    <button
                      onClick={() => logOut()}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                    >
                      Sign Out
                    </button>
                  </Menu.Item>
                ) : (
                  <>
                    <Menu.Item>
                      <Link
                        to="/login"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      >
                        Login
                      </Link>
                    </Menu.Item>
                  </>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
};
