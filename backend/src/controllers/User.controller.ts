import { Request, Response } from "express";
import bcrypt from "bcrypt";
import messages from "./User.messages";
import ResponseSender from "../utils/responseSender";
import InvalidChecker from "../utils/invalidChecker";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class UserController {
	static async registerUser(req: Request, res: Response): Promise<void> {
		const { email, username, password, passwordRepeat } = req.body;

		// Checa se há valores vazios no req.body
		if (InvalidChecker.isEmpty(email, username, password, passwordRepeat)) {
			return ResponseSender.sendMessage(messages.error.emptyValues, req, res);
		}

		// Valida email usando RegEx
		if (!InvalidChecker.regexEmail(email)) {
			return ResponseSender.sendMessage(messages.error.invalidEmail, req, res);
		}

		// Checa se as senhas enviadas são iguais
		if (!InvalidChecker.passwordCompare(password, passwordRepeat)) {
			return ResponseSender.sendMessage(messages.error.diffPasswords, req, res);
		}

		// Checa se a senha é forte
		if (!InvalidChecker.regexPassword(password)) {
			return ResponseSender.sendMessage(messages.error.passwordTooWeak, req, res);
		}

		// Verifica se email e/ou usuário já existem
		const findEmail = await prisma.user.findUnique({ where: { email } });
		if (findEmail) {
			return ResponseSender.sendMessage(messages.error.emailExists, req, res);
		}

		const findUsername = await prisma.user.findUnique({ where: { username } });
		if (findUsername) {
			return ResponseSender.sendMessage(messages.error.usernameExists, req, res);
		}

		// Insere usuário no banco de dados
		await prisma.user.create({
			data: {
				email,
				username,
				password: bcrypt.hashSync(password, 10),
			},
		});

		ResponseSender.sendMessage(messages.success.userCreated, req, res);
	}
}
