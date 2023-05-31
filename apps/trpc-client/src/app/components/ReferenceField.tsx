import { trpc } from '@trpc-client/trpc';
import { UseTRPCInfiniteQueryResult } from '@trpc/react-query/dist/shared';
import { useDescription, useTsController } from '@ts-react/form';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import omit from 'just-omit';
import { TrpcModels } from '@trpc-shared/models';

type OptionType = {
	value: string;
	label: string;
};

export const loadOptions =
	(query: UseTRPCInfiniteQueryResult<any, any>) =>
	async (
		_search: string,
		_prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
	) => {
		const result = await query.fetchNextPage();
		const options = result.data?.pages.at(-1).items.map((it: any) => ({
			value: it.id,
			label: Object.values(omit(it, ['id'])).join(' - '),
		}));
		return {
			options,
			hasMore: result.hasNextPage,
		};
	};

const ReferenceField = ({
	name,
	modelName,
	optional,
}: {
	name: string;
	modelName: TrpcModels;
	optional: boolean;
}) => {
	const { label, placeholder } = useDescription();
	const {
		field: { value, onChange },
		error,
	} = useTsController<string | null>();
	const infiniteQuery = trpc[modelName].cursorPagination.useInfiniteQuery(
		{
			limit: 10,
		},
		{
			getNextPageParam: lastPage => lastPage.nextCursor,
			enabled: false,
		}
	);
	const item = (infiniteQuery.data?.pages || [])
		.map(it => it.items)
		.flat(1)
		.map(it => ({
			value: it.id,
			label: Object.values(omit(it, ['id'])).join(' - '),
		}))
		.find(it => it.value === value);

	return (
		<>
			<label
				htmlFor={name}
				className='block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize'>
				{label}
			</label>
			<AsyncPaginate
				placeholder={placeholder}
				isClearable={optional}
				value={item}
				loadOptions={loadOptions(infiniteQuery)}
				onChange={val => onChange(val?.value)}
			/>
			<span>{error?.errorMessage && error.errorMessage}</span>
		</>
	);
};

export default ReferenceField;
