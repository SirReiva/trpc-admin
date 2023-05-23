import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mergedModels } from '../../../trpc';

const Header = (props: { title: string }) => {
	return (
		<div className='flex lg:space-x-3 justify-center lg:justify-start lg:px-3 border-b border-gray-900 items-center h-14'>
			<h2 className='text-white text-2xl font-semibold hidden lg:inline'>
				{props.title}
			</h2>
		</div>
	);
};

const MenuItem = (props: {
	active?: boolean;
	to: string;
	children?: ReactNode;
	title: string;
}) => {
	let activeClass =
		' text-gray-400 lg:rounded-md hover:text-white hover:bg-gray-700';

	if (props.active) {
		activeClass = ' lg:rounded-md text-white bg-gray-900';
	}

	return (
		<Link
			to={props.to}
			replace
			className={
				'lg:mx-2 py-4 lg:py-2 lg:px-3 flex justify-center lg:justify-start space-x-4 items-center truncate capitalize ' +
				activeClass
			}>
			{props.children}
			<span className='hidden lg:inline'>{props.title}</span>
		</Link>
	);
};

const SideMenu = () => {
	const location = useLocation();
	return (
		<div className='bg-gray-800 overflow-y-auto h-screen'>
			<Header title='Admin' />
			<ul className='lg:mt-2 lg:space-y-2'>
				{Object.keys(mergedModels).map(name => (
					<MenuItem
						key={name}
						to={'/admin/' + name}
						title={name}
						active={location.pathname === '/admin/' + name}></MenuItem>
				))}

				<div>
					<span className='my-3 lg:my-5 border-b border-gray-900 block'></span>
				</div>

				<MenuItem to='/' title='Settings'></MenuItem>
			</ul>
		</div>
	);
};

export default SideMenu;
