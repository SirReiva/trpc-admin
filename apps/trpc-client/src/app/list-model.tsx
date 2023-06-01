import { TrpcModels, models } from '@trpc-shared/models';
import { InferBaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { FaPlusCircle } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { Link, useSearchParams } from 'react-router-dom';
import { Column, usePagination, useTable } from 'react-table';
import { trpc } from '../trpc';
import { Modal } from 'react-responsive-modal';
import { useState } from 'react';

const Table = ({
	columns,
	data,
	showActions,
	onDelete,
}: {
	columns: Array<Column<InferBaseModelType>>;
	data: Array<InferBaseModelType>;
	showActions: boolean;
	onDelete: (id: string) => void;
}) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable<InferBaseModelType>(
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
							{showActions && (
								<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</th>
							)}
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
								{showActions && (
									<td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
										<button
											onClick={() => onDelete(row.original.id)}
											className='text-red-600 text-xl'>
											<MdDeleteForever />
										</button>
									</td>
								)}
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

const ListModelBuilder = (name: TrpcModels) => {
	const model = models[name];
	const columns = typedObjectEntries(model.shape)
		.filter(([name]) => name !== 'id')
		.map(([name]) => ({
			Header: name,
			accessor: name,
		}));

	const pageSize = 10;

	return () => {
		const [searchParams, SetURLSearchParams] = useSearchParams();
		const [current, setCurrent] = useState<null | string>(null);

		const page = parseInt(searchParams.get('page') ?? '1');

		//@ts-expect-error
		const listQuery = trpc[name].list.useQuery({ page, pageSize });
		const deleteModel = trpc[name].deleteById.useMutation();

		const data = listQuery.data as {
			total: number;
			data: Array<InferBaseModelType>;
		};

		if (data) {
			const { total, data: items } = data;
			return (
				<>
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
						<Table
							data={items}
							columns={columns}
							showActions={true}
							onDelete={setCurrent}
						/>
						<TablePagination
							totalPages={Math.max(1, Math.ceil(total / pageSize))}
							currentPage={page}
							goToPage={page => SetURLSearchParams({ page: page.toString() })}
						/>
					</div>
					<Modal
						open={!!current}
						onClose={() => setCurrent(null)}
						center
						classNames={{
							modal: 'overflow-visible',
							closeButton:
								'-top-4 -right-4 bg-red-500 rounded-full fill-white p-1',
						}}>
						<h2 className='text-lg font-semibold'>Delete {name}</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
							pulvinar risus non risus hendrerit venenatis. Pellentesque sit
							amet hendrerit risus, sed porttitor quam.
						</p>
						<hr className='my-3' />
						<div className='flex gap-4 justify-end'>
							<button
								className='bg-red-500 px-4 py-2 rounded-md text-white inline-flex justify-center items-center gap-2'
								onClick={async () => {
									if (!current) return;
									await deleteModel.mutateAsync({
										id: current,
									});
									await listQuery.refetch();
									setCurrent(null);
								}}>
								<span className='capitalize'>Delete</span>
							</button>
							<button
								className='bg-blue-500 px-4 py-2 rounded-md text-white inline-flex justify-center items-center gap-2'
								onClick={() => setCurrent(null)}>
								<span className='capitalize'>Cancel</span>
							</button>
						</div>
					</Modal>
				</>
			);
		}
		if (listQuery.isLoading) return <ListLoader />;

		return null;
	};
};

export default ListModelBuilder;
