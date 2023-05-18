import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { usePagination, useTable } from 'react-table';
import { TrpcModels, trpc } from '../trpc';

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

const bulidListModel = (model: BaseModelType, name: TrpcModels) => {
	const columns = typedObjectEntries(model.shape)
		.filter(([name]) => name !== 'id')
		.map(([name]) => ({
			Header: name,
			accessor: name,
		}));

	return () => {
		const listQuery = trpc[name].list.useQuery({ page: 1, pageSize: 10 });

		if (listQuery.isLoading) return <ListLoader />;

		return (
			<div className='flex flex-col space-y-2'>
				<h2 className='font-medium text-2xl capitalize'>{name}</h2>
				<Table data={listQuery.data?.data || []} columns={columns} />
			</div>
		);
	};
};

export default bulidListModel;
