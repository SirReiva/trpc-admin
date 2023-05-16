import { trpc } from '../client';

const Test = () => {
	const userCreator = trpc.user.create.useMutation();
	return (
		<button
			onClick={async () => {
				await userCreator.mutateAsync({
					name: 'zasca',
					password: 'qwerty',
					id: '505771ce-d902-4b05-94fe-f7038adc2f1c',
				});
			}}>
			Click
		</button>
	);
};

export default Test;
