import { Request, Response } from "express";
import { Message } from "../types/Message.type";

export default class ResponseUtils {
	// Envia uma resposta a requisição com uma mensagem padronizada
	static sendMessage(entry: Message, req: Request, res: Response) {
		res.status(entry.status).json(entry.json);
	}
}
