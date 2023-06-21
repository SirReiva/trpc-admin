import { TrpcModels, models } from '@trpc-shared/models';
import { InferBaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { TRPCClientError } from '@trpc/client';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { RiCloseFill } from 'react-icons/ri';
import { Modal } from 'react-responsive-modal';
import { Link, useSearchParams } from 'react-router-dom';
import { Column, usePagination, useTable } from 'react-table';
import { trpc } from '../trpc';
import { match } from 'ts-pattern';

const renderCell = (data: string | boolean | number | null | undefined) => {
	if (data === null || data === undefined) return '';
	const typeofData = typeof data;
	if (['number', 'string'].includes(typeofData)) return data;

	if (data) return <TiTick className='text-green-600 scale-150 inline-block' />;
	return <RiCloseFill className='text-red-600 scale-150 inline-block' />;
};

const Table = ({
	columns,
	data,
	showActions,
	onDelete,
	modelName,
}: {
	columns: Array<Column<InferBaseModelType>>;
	data: Array<InferBaseModelType>;
	showActions: boolean;
	onDelete: (id: string) => void;
	modelName: TrpcModels;
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
											{renderCell(cell.value)}
										</td>
									);
								})}
								{showActions && (
									<td className='px-6 py-4 whitespace-nowrap text-sm justify-center items-center flex gap-2'>
										<Link
											to={`/admin/${modelName}/edit/${row.original.id}`}
											className='text-blue-300 text-xl inline-flex'>
											<MdEdit />
										</Link>
										<button
											onClick={() => onDelete(row.original.id)}
											className='text-red-600 text-xl inline-flex'>
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
		const [current, setCurrent] = useState<{
			loading: boolean;
			id: string | null;
		}>({ id: null, loading: false });

		const page = parseInt(searchParams.get('page') ?? '1');

		const listQuery: UseTRPCQueryResult<
			{ data: Array<InferBaseModelType>; total: number },
			TRPCClientError<any>
		> = (trpc[name].list as any).useQuery({ page, pageSize });

		const deleteModel = trpc[name].deleteById.useMutation();

		return match(listQuery)
			.returnType<React.JSX.Element | null>()
			.with({ isLoading: true }, () => <ListLoader />)
			.with({ isError: true }, () => null)
			.with({ isLoading: false, isError: false }, data => {
				const { total, data: items } = data.data;
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
								modelName={name}
								data={items}
								columns={columns}
								showActions={true}
								onDelete={id => setCurrent({ loading: false, id })}
							/>
							<TablePagination
								totalPages={Math.max(1, Math.ceil(total / pageSize))}
								currentPage={page}
								goToPage={page => SetURLSearchParams({ page: page.toString() })}
							/>
						</div>
						<Modal
							open={!!current.id}
							onClose={() => setCurrent({ id: null, loading: false })}
							center
							classNames={{
								modal: 'overflow-visible rounded-lg shadow-md',
								closeButton:
									'-top-4 -right-4 bg-red-500 rounded-full fill-white p-1',
							}}>
							<h2 className='text-lg font-semibold'>Delete {name}</h2>
							<hr className='my-3' />
							<div className='flex gap-4 justify-end'>
								<button
									className='bg-red-500 px-4 py-2 rounded-md text-white inline-flex justify-center items-center gap-2'
									onClick={async () => {
										if (!current.id) return;
										setCurrent({ id: current.id, loading: true });
										await deleteModel.mutateAsync({
											id: current.id,
										});
										await listQuery.refetch();
										setCurrent({ id: null, loading: false });
									}}>
									<span className='capitalize'>Delete</span>
								</button>
								<button
									className='bg-blue-500 px-4 py-2 rounded-md text-white inline-flex justify-center items-center gap-2'
									onClick={() => setCurrent({ id: null, loading: false })}>
									<span className='capitalize'>Cancel</span>
								</button>
							</div>
						</Modal>
					</>
				);
			})
			.exhaustive();
	};
};

export default ListModelBuilder;
