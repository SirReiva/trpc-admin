export const parseMessage = (data: string) => {
	try {
		return JSON.parse(data);
	} catch (err) {
		return {};
	}
};
