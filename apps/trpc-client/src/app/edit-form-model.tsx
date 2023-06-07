import { trpc } from '@trpc-client/trpc';
import { TrpcModels, models } from '@trpc-shared/models';
import {
	BaseModelType,
	InferBaseModelType,
} from '@trpc-shared/models/BaseModel';
import { unWrapAll } from '@trpc-shared/utils/schemas';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { createTsForm } from '@ts-react/form';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { match } from 'ts-pattern';
import Loader from './components/Loader';
import { formMapping } from './form-mapping';

const Form = createTsForm(formMapping);

const EditModelBuilder = (name: TrpcModels) => {
	const model = models[name] as BaseModelType;
	const idLessModel = model.omit({ id: true });

	return () => {
		let { modelId } = useParams();
		const modelUpdator = trpc[name].updateById.useMutation();

		const navigate = useNavigate();

		const onSubmit = useCallback(
			async (data: any) => {
				await modelUpdator.mutateAsync({
					data: {
						...data,
					},
					id: modelId as string,
				});
				navigate('/admin/' + name);
			},
			[navigate, modelUpdator]
		);

		const props = Object.entries(idLessModel.shape).reduce(
			(acc, [name, model]: [string, any]) => {
				const baseModel = unWrapAll(model);
				return {
					...acc,
					[name]: {
						...(baseModel.getMeta() || {}),
						label: name,
						placeholder: name,
						options: Object.values((model as any)?.enum || {}),
						optional: model.isOptional() || model.isNullable(),
					},
				};
			},
			{}
		) as any;

		const modelQuery: UseTRPCQueryResult<InferBaseModelType, any> = (
			trpc[name].getById as any
		).useQuery({ id: modelId });

		return match(modelQuery)
			.with({ isLoading: true }, () => <Loader />)
			.with({ isRefetching: true }, () => <Loader />)
			.with({ isError: true }, () => null)
			.with({ isError: false, isLoading: false }, () => (
				<>
					<h2 className='my-6 font-bold'>
						Edit <span className='capitalize'>{name}</span>
					</h2>
					<Form
						defaultValues={modelQuery.data}
						schema={idLessModel}
						onSubmit={onSubmit}
						renderAfter={() => (
							<button
								type='submit'
								className='mt-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
								Submit
							</button>
						)}
						props={props}
					/>
					{modelUpdator.isLoading && (
						<div role='status'>
							<svg
								aria-hidden='true'
								className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
								viewBox='0 0 100 101'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
									fill='currentColor'
								/>
								<path
									d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
									fill='currentFill'
								/>
							</svg>
							<span className='sr-only'>Loading...</span>
						</div>
					)}
				</>
			))
			.exhaustive();
	};
};

export default EditModelBuilder;
