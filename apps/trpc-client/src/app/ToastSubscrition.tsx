import { trpc } from '@trpc-client/trpc';
import { models } from '@trpc-shared/models';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import toast, { Toaster } from 'react-hot-toast';

const ToastSubscriptoin = () => {
	typedObjectEntries(models).forEach(([name]) => {
		trpc[name].onCreate.useSubscription(undefined, {
			onData() {
				toast.success(`${name} created`);
			},
		});
	});
	return <Toaster />;
};

export default ToastSubscriptoin;
