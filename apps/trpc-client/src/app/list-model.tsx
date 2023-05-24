import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { Link, useSearchParams } from 'react-router-dom';
import { usePagination, useTable } from 'react-table';
import { TrpcModels, trpc } from '../trpc';
import { FaPlusCircle } from 'react-icons/fa';

const Table = ({
	columns,
	data,
}: {
	columns: Array<{ Header: string; accessor: string }>;
	data: Array<any>;
}) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable(
			{
				columns,
				data,
			},
			usePagination
		);
	return (
		<div className='shadow overflow-x-auto overflow-y-hidden rounded-md'>
			<table className='min-w-full divide-y' {...getTableProps()}>
				<thead className='bg-gray-50'>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th
									className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									{...column.getHeaderProps()}>
									{column.render('Header')}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className='bg-white divide-y' {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map(cell => {
									return (
										<td
											{...cell.getCellProps()}
											className='px-6 py-4 whitespace-nowrap text-sm'>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

const ListLoader = () => (
	<div
		role='status'
		className='p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700'>
		<div className='flex items-center justify-between'>
			<div>
				<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
				<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			</div>
			<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
		</div>
		<div className='flex items-center justify-between pt-4'>
			<div>
				<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
				<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			</div>
			<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
		</div>
		<div className='flex items-center justify-between pt-4'>
			<div>
				<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
				<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			</div>
			<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
		</div>
		<div className='flex items-center justify-between pt-4'>
			<div>
				<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
				<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			</div>
			<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
		</div>
		<div className='flex items-center justify-between pt-4'>
			<div>
				<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
				<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
			</div>
			<div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
		</div>
		<span className='sr-only'>Loading...</span>
	</div>
);

const TablePagination = ({
	currentPage,
	totalPages,
	goToPage,
}: {
	currentPage: number;
	totalPages: number;
	goToPage: (page: number) => void;
}) => {
	return (
		<div className='flex flex-row-reverse'>
			<nav
				className='rounded-md border divide-x bg-white mt-4 text-sm text-gray-700'
				aria-label='Pagination'>
				<button
					onClick={() => goToPage(currentPage - 1)}
					className='px-3 py-2 focus:outline-none disabled:opacity-25'
					disabled={currentPage === 1}>
					Prev
				</button>
				{Array.from(Array(totalPages).keys())
					.map(i => i + 1)
					.filter(
						index =>
							Math.abs(currentPage - index) < 3 ||
							index < 3 ||
							totalPages - index < 2
					)
					.map((index, _, arr) => (
						<div
							className='inline-flex justify-center items-center'
							key={index}>
							<button
								disabled={index === currentPage}
								className={`px-4 py-2 focus:outline-none ${
									index === currentPage ? 'text-white bg-blue-600' : ''
								}`}
								onClick={() => goToPage(index)}>
								{index}
							</button>
							{!arr.includes(index + 1) && index + 1 < totalPages && (
								<div className='px-4 py-2 h-full flex justify-center items-center cursor-default leading-1_25 transition duration-150 ease-in border-l'>
									...
								</div>
							)}
						</div>
					))}
				<button
					onClick={() => goToPage(currentPage + 1)}
					className='px-3 py-2 focus:outline-none disabled:opacity-25'
					disabled={currentPage === totalPages}>
					Next
				</button>
			</nav>
		</div>
	);
};

const bulidListModel = (model: BaseModelType, name: TrpcModels) => {
	const columns = typedObjectEntries(model.shape)
		.filter(([name]) => name !== 'id')
		.map(([name]) => ({
			Header: name,
			accessor: name,
		}));

	const pageSize = 10;

	return () => {
		const [searchParams, SetURLSearchParams] = useSearchParams();

		const page = parseInt(searchParams.get('page') ?? '1');

		//@ts-ignore
		const listQuery = trpc[name].list.useQuery({ page, pageSize });

		if (listQuery.isLoading) return <ListLoader />;

		const total = listQuery.data?.total ?? 0;

		return (
			<div className='flex flex-col'>
				<h2 className='font-medium text-2xl capitalize'>{name}</h2>
				<div className='block my-4'>
					<Link
						className='bg-blue-500 px-4 py-2 rounded-md text-white inline-flex justify-center items-center gap-2'
						to={'/admin/' + name + '/new'}>
						<FaPlusCircle className='inline' /> Add{' '}
						<span className='capitalize'>{name}</span>
					</Link>
				</div>
				<Table data={listQuery.data?.data || []} columns={columns} />
				<TablePagination
					totalPages={Math.max(1, Math.ceil(total / pageSize))}
					currentPage={page}
					goToPage={page => SetURLSearchParams({ page: page.toString() })}
				/>
			</div>
		);
	};
};

export default bulidListModel;
