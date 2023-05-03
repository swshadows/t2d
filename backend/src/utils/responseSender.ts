import { Request, Response } from "express";

type Message = {
	status: number;
	json: {
		error?: string;
		success?: string;
		code: string;
	};
};

export default class ResponseSender {
	static sendMessage(entry: Message, req: Request, res: Response) {
		res.status(entry.status).json(entry.json);
	}
}
