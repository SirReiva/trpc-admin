import { trpc } from '@trpc-client/trpc';
import { models } from '@trpc-shared/models';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { capitalizeFirstLetter } from '@trpc-shared/utils/string';
import toast from 'react-hot-toast';

const useModelsSubscriptions = () => {
	typedObjectEntries(models).forEach(([name]) => {
		trpc[name].onCreate.useSubscription(undefined, {
			onData() {
				toast.success(`${capitalizeFirstLetter(name)} created`);
			},
		});
		trpc[name].onDelete.useSubscription(undefined, {
			onData() {
				toast.success(`${capitalizeFirstLetter(name)} deleted`);
			},
		});
	});
};

export default useModelsSubscriptions;
