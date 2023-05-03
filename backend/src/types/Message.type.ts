export type Message = {
	status: number;
	json: {
		error?: string;
		success?: string;
		code: string;
	};
};
