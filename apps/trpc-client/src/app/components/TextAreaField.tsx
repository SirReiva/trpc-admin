import { useTsController } from '@ts-react/form';

const TextAreaField = (props: {
	name: string;
	label?: string;
	placeholder?: string;
}) => {
	const { label, placeholder, name } = props;
	const {
		field: { onChange, value },
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
			<textarea
				id={name}
				rows={4}
				className={`placeholder:capitalize block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${inputClass}`}
				placeholder={placeholder}
				onChange={e => {
					onChange(e.target.value);
				}}>
				{value}
			</textarea>
			{!!error && (
				<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
					{error.errorMessage}
				</p>
			)}
		</div>
	);
};

export default TextAreaField;
