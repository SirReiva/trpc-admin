import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

function NavBar() {
	const { logOut, auth } = useAuth();
	const nativate = useNavigate();
	return (
		<nav className='flex items-center space-x-4 shadow bg-white w-full px-5 absolute h-14'>
			<div className='hidden md:inline-flex flex-1'></div>

			<Menu as='div' className='relative inline-block text-left'>
				<div>
					<Menu.Button className='inline-flex justify-center w-full items-center text-gray-500 hover:text-gray-800 focus:outline-none'>
						<span className='font-medium ml-3 mr-1'>
							{auth?.data.identifier}[{auth?.data.role}]
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
										} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
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
