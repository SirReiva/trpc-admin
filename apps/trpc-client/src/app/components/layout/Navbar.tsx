import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { RiLogoutBoxRFill } from 'react-icons/ri';

function NavBar() {
	const { logOut, auth } = useAuth();
	const nativate = useNavigate();
	return (
		<nav className='flex items-center space-x-4 shadow bg-white w-full px-5 absolute h-14'>
			<div className='hidden md:inline-flex flex-1'></div>

			<Menu as='div' className='relative inline-block text-left'>
				<div>
					<Menu.Button className='inline-flex justify-center w-full items-center text-gray-500 hover:text-gray-800 focus:outline-none'>
						<span className='font-medium ml-3 m-1'>
							<b className='mx-2'>{auth?.data.identifier}</b>
							<span className='bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300'>
								{auth?.data.role}
							</span>
						</span>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'>
					<Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
						<div className='px-1 py-1 '>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => {
											logOut();
											nativate('/login');
										}}
										className={`${
											active ? 'bg-indigo-600 text-white' : 'text-gray-900'
										} group flex rounded-md items-center w-full px-2 py-2 text-sm gap-2`}>
										<RiLogoutBoxRFill className='text-lg' />
										Sign out
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</nav>
	);
}

export default NavBar;
