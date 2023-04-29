import { Request, Response } from "express";
import bcrypt from "bcrypt";
import messages from "./User.messages";
import ResponseSender from "../utils/responseSender";
import InvalidChecker from "../utils/invalidChecker";
import UserUtils from "./User.utils";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const { error: err, success: suc } = messages;

export default class UserController {
	static async registerUser(req: Request, res: Response): Promise<void> {
		const { email, username, password, passwordRepeat } = req.body;

		// Checa se há valores vazios no req.body
		if (InvalidChecker.isEmpty(email, username, password, passwordRepeat)) {
			return ResponseSender.sendMessage(err.emptyValues, req, res);
		}

		// Valida email usando RegEx
		if (!UserUtils.isEmailValid(email)) {
			return ResponseSender.sendMessage(err.invalidEmailRegex, req, res);
		}

		// Checa se as senhas enviadas são iguais
		if (!UserUtils.arePasswordsEqual(password, passwordRepeat)) {
			return ResponseSender.sendMessage(err.diffPasswords, req, res);
		}

		// Checa se a senha é forte
		if (!UserUtils.isPasswordValid(password)) {
			return ResponseSender.sendMessage(err.passwordTooWeak, req, res);
		}

		// Verifica se email e/ou usuário já existem
		const findEmail = await prisma.user.findUnique({ where: { email } });
		if (findEmail) {
			return ResponseSender.sendMessage(err.emailExists, req, res);
		}

		const findUsername = await prisma.user.findUnique({ where: { username } });
		if (findUsername) {
			return ResponseSender.sendMessage(err.usernameExists, req, res);
		}

		// Insere usuário no banco de dados
		await prisma.user.create({
			data: {
				email,
				username,
				password: bcrypt.hashSync(password, 10),
			},
		});

		ResponseSender.sendMessage(suc.userCreated, req, res);
	}

	static async loginUser(req: Request, res: Response): Promise<void> {
		// Checa se o usuário já está logado
		if (req.session.user) {
			return ResponseSender.sendMessage(err.alreadyLogged, req, res);
		}

		const { login, password } = req.body;

		// Checa se há valores vazios no req.body
		if (InvalidChecker.isEmpty(login, password)) {
			return ResponseSender.sendMessage(err.emptyValues, req, res);
		}

		// Checa se o usuário existe, usando email ou username
		const findUser = await prisma.user.findFirst({ where: { OR: [{ email: login }, { username: login }] } });

		if (!findUser) {
			return ResponseSender.sendMessage(err.userNotFound, req, res);
		}

		// Checa se a senha enviada está correta
		if (!UserUtils.isPasswordCorrect(password, findUser.password)) {
			return ResponseSender.sendMessage(err.passwordWrong, req, res);
		}

		// Cria a sessão
		req.session.user = {
			email: findUser.email,
			username: findUser.username,
		};

		ResponseSender.sendMessage(suc.userLogged, req, res);
	}

	static logoutUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(err.notLoggedYet, req, res);
		}

		// Destroi a sessão, fazendo logout
		req.session.destroy((err) => {
			if (err) throw err;
		});

		ResponseSender.sendMessage(suc.userLogout, req, res);
	}

	static async getUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(err.notLoggedYet, req, res);
		}

		res.status(200).json(req.session.user);
	}

	static async updateEmail(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(err.notLoggedYet, req, res);
		}
		const { email } = req.body;
		// Checa se o email está preenchido
		if (!email) {
			return ResponseSender.sendMessage(err.emptyValues, req, res);
		}

		// Checa se o regex do email é válido
		if (!UserUtils.isEmailValid(email)) {
			return ResponseSender.sendMessage(err.invalidEmailRegex, req, res);
		}

		// Checa se o email já está em uso
		const findEmail = await prisma.user.findUnique({ where: { email } });
		if (findEmail) {
			return ResponseSender.sendMessage(err.emailExists, req, res);
		}

		// Atualiza o email
		await prisma.user.update({ where: { email: req.session.user.email }, data: { email: email } });
		req.session.user.email = email;

		ResponseSender.sendMessage(suc.emailUpdated, req, res);
	}

	static async updatePassword(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(err.notLoggedYet, req, res);
		}

		// Checa se há valores nos campos de senha vazios
		const { password, newPassword, newPasswordRepeat } = req.body;
		if (InvalidChecker.isEmpty(password, newPassword, newPasswordRepeat)) {
			return ResponseSender.sendMessage(err.emptyValues, req, res);
		}

		// Compara as 2 novas senhas enviadas
		if (!UserUtils.arePasswordsEqual(newPassword, newPasswordRepeat)) {
			return ResponseSender.sendMessage(err.diffPasswords, req, res);
		}

		// Checa se a senha é forte
		if (!UserUtils.isPasswordValid(password)) {
			return ResponseSender.sendMessage(err.passwordTooWeak, req, res);
		}

		// Compara a senha enviada com a senha no banco
		const findUser = await prisma.user.findUnique({ where: { email: req.session.user.email } });
		if (!findUser) {
			return ResponseSender.sendMessage(err.userNotFound, req, res);
		}
		if (!UserUtils.isPasswordCorrect(password, findUser.password)) {
			return ResponseSender.sendMessage(err.passwordWrong, req, res);
		}

		// Atualiza a senha
		await prisma.user.update({ where: { email: req.session.user.email }, data: { password: bcrypt.hashSync(newPassword, 10) } });
		ResponseSender.sendMessage(suc.passwordUpdated, req, res);
	}

	static async deleteUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(err.notLoggedYet, req, res);
		}

		// Apaga o usuário do banco
		await prisma.user.delete({ where: { email: req.session.user.email } });

		// Destroi a sessão, fazendo logout
		req.session.destroy((err) => {
			if (err) throw err;
		});

		ResponseSender.sendMessage(suc.userDeleted, req, res);
	}
}
