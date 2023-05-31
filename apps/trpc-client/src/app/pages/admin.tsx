import NavBar from '../components/layout/Navbar';
import SideMenu from '../components/layout/SideMenu';
import { Outlet } from 'react-router-dom';
import useModelsSubscriptions from '../hooks/useModelsSubscrition';

const Admin = () => {
	useModelsSubscriptions();
	return (
		<div className='grid grid-cols-6 md:grid-cols-10 gap-0 h-full'>
			<div className='col-span-1 md:col-span-1 lg:col-span-2'>
				<SideMenu />
			</div>
			<div className='col-span-5 md:col-span-9 lg:col-span-8 h-full'>
				<div className='relative'>
					<NavBar />
					<div className='overflow-y-auto h-screen flex flex-col'>
						<div className='flex-shrink-0 p-5 mt-14'>
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
