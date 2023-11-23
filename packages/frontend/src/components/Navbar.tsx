import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setWindowCurrent } from '../store/calendar.slice';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { clearUser } from '../store/auth.slice';
import { UserCircleIcon as UserCircleOutline } from '@heroicons/react/24/outline';
import { UserCircleIcon as UserCircleSolid } from '@heroicons/react/24/solid';

export const Navbar = () => {
  const { window } = useSelector((state: RootState) => state.calendar);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const nextScreen = setWindowCurrent(window.current + window.size);
  const nextDay = setWindowCurrent(window.current + 1);
  const prevDay = setWindowCurrent(window.current - 1);
  const prevScreen = setWindowCurrent(window.current - window.size);

  return (
    <nav className="bg-darkpurple-400">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-10" src={logoSvg} alt="Calendar Todo" />
            </Link>
          </div>
          {user && (
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => dispatch(prevScreen)}
                  >
                    &lt;&lt;
                  </button>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => dispatch(prevDay)}
                  >
                    &lt;
                  </button>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => dispatch(nextDay)}
                  >
                    &gt;
                  </button>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => dispatch(nextScreen)}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
          )}

          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="relative flex max-w-xs items-center rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {user ? (
                  <UserCircleSolid className="h-8 w-8 rounded-full text-white" />
                ) : (
                  <UserCircleOutline className="h-8 w-8 rounded-full text-white" />
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
                      onClick={() => dispatch(clearUser())}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                    >
                      Sign Out
                    </button>
                  </Menu.Item>
                ) : (
                  <>
                    <Menu.Item>
                      <Link
                        to="/login"
                        className="w-full block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
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
