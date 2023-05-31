import { useDescription, useTsController } from '@ts-react/form';

const SelectField = ({ options }: { options: string[] }) => {
	const { label, placeholder } = useDescription();
	const {
		field: { value, onChange, name },
		error,
	} = useTsController<string>();
	return (
		<>
			<label
				htmlFor={name}
				className='block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize'>
				{label}
			</label>
			<select
				id={name}
				className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				value={value ? value : ''}
				onChange={e => onChange(e.target.value)}>
				<option value=''>{placeholder}</option>
				{options.map(e => (
					<option key={e} value={e}>
						{e}
					</option>
				))}
			</select>
			<span>{error?.errorMessage && error.errorMessage}</span>
		</>
	);
};

export default SelectField;
