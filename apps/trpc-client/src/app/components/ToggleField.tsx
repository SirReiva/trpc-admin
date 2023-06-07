import { Switch } from '@headlessui/react';
import { useDescription, useTsController } from '@ts-react/form';

const ToogleField = () => {
	const { label } = useDescription();
	const {
		field: { onChange, value, name },
		// fieldState: { invalid, isDirty },
		// error,
	} = useTsController<boolean>();
	return (
		<div className='flex items-center mb-6 gap-4'>
			<label htmlFor={name}>{label}</label>
			<Switch
				name={name}
				defaultChecked={value}
				onChange={onChange}
				className={`${
					value ? 'bg-blue-600' : 'bg-gray-200'
				} relative inline-flex h-6 w-11 items-center rounded-full`}>
				<span className='sr-only'>Enable notifications</span>
				<span
					className={`${
						value ? 'translate-x-6' : 'translate-x-1'
					} inline-block h-4 w-4 transform rounded-full bg-white transition`}
				/>
			</Switch>
		</div>
	);
};

export default ToogleField;
