import { useDescription, useTsController } from '@ts-react/form';

const TextField = () => {
	const { label, placeholder } = useDescription();
	const {
		field: { onChange, value, name },
		fieldState: { invalid, isDirty },
		error,
	} = useTsController<string>();
	const labelClass = !isDirty
		? ''
		: !invalid
		? 'text-green-700 dark:text-green-500'
		: 'text-red-700 dark:text-red-500';
	const inputClass = !isDirty
		? ''
		: !invalid
		? 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500 dark:bg-green-100 dark:border-green-400'
		: 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400';
	return (
		<div className='mb-6'>
			<label
				htmlFor={name}
				className={`block mb-2 text-sm font-medium ${labelClass} capitalize`}>
				{label}
			</label>
			<input
				defaultValue={value}
				type='text'
				onChange={e => {
					onChange(e.target.value);
				}}
				id={name}
				className={`block w-full p-2.5 text-sm rounded-lg placeholder:capitalize ${inputClass}`}
				placeholder={placeholder}
			/>
			{!!error && (
				<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
					{error.errorMessage}
				</p>
			)}
		</div>
	);
};

export default TextField;
