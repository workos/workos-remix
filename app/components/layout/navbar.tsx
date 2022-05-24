import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Form, Link } from '@remix-run/react';
import {
  Cross2Icon,
  HamburgerMenuIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { useOptionalUser } from '~/hooks/useOptionalUser';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  const user = useOptionalUser();
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  {user && (
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <Cross2Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <HamburgerMenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  )}
                </div>
                <div className="flex-shrink-0  text-lg flex items-center">
                  <Link to="/">WorkOS + Remix</Link>
                </div>
              </div>
              {user && (
                <div className="flex items-center">
                  <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <PersonIcon className="h-7 w-7 text-white bg-indigo-500 p-1.5 rounded-full" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <p className="block px-4 py-2 mb-3 text-xs text-gray-700 border-b-2 border-gray-200">
                              {user?.email}
                            </p>
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700',
                                )}
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Form action="/logout" method="post">
                                <button
                                  type="submit"
                                  className="hover:bg-gray-100 w-full text-left block px-4 py-2 text-sm text-gray-700"
                                >
                                  Logout
                                </button>
                              </Form>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              )}
            </div>
          </div>
          {user && (
            <Disclosure.Panel className="md:hidden">
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <PersonIcon className="h-7 w-7 text-white  bg-indigo-500 p-1.5 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm  text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="a"
                    href="/settings"
                    className="block px-4 py-2 text-base  text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/logout"
                    className="block px-4 py-2 text-base  text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6"
                  >
                    Log out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
