import { useTsController } from '@ts-react/form';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

const MDXField = (props: { name: string; label?: string }) => {
	const { label, name } = props;
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
	// const inputClass = !isDirty
	// 	? ''
	// 	: !invalid
	// 	? 'bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500 dark:bg-green-100 dark:border-green-400'
	// 	: 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:bg-red-100 dark:border-red-400';
	return (
		<div className='mb-6'>
			<label
				htmlFor={name}
				className={`block mb-2 text-sm font-medium ${labelClass} capitalize`}>
				{label}
			</label>
			<MDEditor
				value={value}
				onChange={data => onChange(data)}
				previewOptions={{
					rehypePlugins: [[rehypeSanitize]],
				}}
				style={{ backgroundColor: 'transparent' }}
			/>
			{/* <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
			{!!error && (
				<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
					{error.errorMessage}
				</p>
			)}
		</div>
	);
};

export default MDXField;
