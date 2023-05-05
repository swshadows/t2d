import { Request, Response } from "express";
import bcrypt from "bcrypt";

import ResponseUtils, { Messages } from "../utils/Response.utils";
import SystemUtils from "../utils/System.utils";
import UserUtils from "../utils/User.utils";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const { error: userErr, success: userSuc } = Messages.userMessages;
const { error: sysErr } = Messages.systemMessages;

export default class UserController {
	static async validateSession(req: Request, res: Response) {
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}
		res.status(200).send(req.session.user);
	}
	static async registerUser(req: Request, res: Response) {
		// Checa se o usuário já está logado
		if (req.session.user) {
			return ResponseUtils.sendMessage(userErr.alreadyLogged, req, res);
		}

		const { email, username, password, passwordRepeat } = req.body;

		// Checa se há valores vazios no req.body
		if (SystemUtils.isEmpty(email, username, password, passwordRepeat)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Valida email usando RegEx
		if (!UserUtils.isEmailValid(email)) {
			return ResponseUtils.sendMessage(userErr.invalidEmailRegex, req, res);
		}

		// Checa se as senhas enviadas são iguais
		if (!UserUtils.arePasswordsEqual(password, passwordRepeat)) {
			return ResponseUtils.sendMessage(userErr.diffPasswords, req, res);
		}

		// Checa se a senha é forte
		if (!UserUtils.isPasswordValid(password)) {
			return ResponseUtils.sendMessage(userErr.passwordTooWeak, req, res);
		}

		// Verifica se email e/ou usuário já existem
		const findEmail = await prisma.user.findUnique({ where: { email } });
		if (findEmail) {
			return ResponseUtils.sendMessage(userErr.emailExists, req, res);
		}

		const findUsername = await prisma.user.findUnique({ where: { username } });
		if (findUsername) {
			return ResponseUtils.sendMessage(userErr.usernameExists, req, res);
		}

		// Insere usuário no banco de dados
		await prisma.user.create({
			data: {
				email,
				username,
				password: bcrypt.hashSync(password, 10),
			},
		});

		ResponseUtils.sendMessage(userSuc.userCreated, req, res);
	}

	static async loginUser(req: Request, res: Response) {
		// Checa se o usuário já está logado
		if (req.session.user) {
			return ResponseUtils.sendMessage(userErr.alreadyLogged, req, res);
		}

		const { login, password } = req.body;

		// Checa se há valores vazios no req.body
		if (SystemUtils.isEmpty(login, password)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Checa se o usuário existe, usando email ou username
		const findUser = await prisma.user.findFirst({ where: { OR: [{ email: login }, { username: login }] } });

		if (!findUser) {
			return ResponseUtils.sendMessage(userErr.userNotFound, req, res);
		}

		// Checa se a senha enviada está correta
		if (!UserUtils.isPasswordCorrect(password, findUser.password)) {
			return ResponseUtils.sendMessage(userErr.passwordWrong, req, res);
		}

		// Cria a sessão
		req.session.user = {
			id: findUser.id,
			email: findUser.email,
			username: findUser.username,
		};

		ResponseUtils.sendMessage(userSuc.userLogged, req, res);
	}

	static logoutUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Destroi a sessão, fazendo logout
		req.session.destroy((err) => {
			if (err) throw err;
		});

		ResponseUtils.sendMessage(userSuc.userLogout, req, res);
	}

	static async getUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se foi enviado o nome do usuário
		const { username } = req.params;
		if (!username) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Procura o usuário de acordo com o req.param enviado
		const user = await prisma.user.findUnique({ where: { username }, select: { username: true, email: true } });
		if (!user) {
			return ResponseUtils.sendMessage(userErr.userNotFound, req, res);
		}

		res.status(200).json(user);
	}

	static async updateEmail(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}
		const { email } = req.body;
		// Checa se o email está preenchido
		if (!email) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Checa se o regex do email é válido
		if (!UserUtils.isEmailValid(email)) {
			return ResponseUtils.sendMessage(userErr.invalidEmailRegex, req, res);
		}

		// Checa se o email já está em uso
		const findEmail = await prisma.user.findUnique({ where: { email } });
		if (findEmail) {
			return ResponseUtils.sendMessage(userErr.emailExists, req, res);
		}

		// Atualiza o email
		await prisma.user.update({ where: { email: req.session.user.email }, data: { email: email } });
		req.session.user.email = email;

		ResponseUtils.sendMessage(userSuc.emailUpdated, req, res);
	}

	static async updateUsername(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}
		const { username } = req.body;
		// Checa se o nome de usuário está preenchido
		if (!username) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Checa se o nome de usuário já está em uso
		const findUsername = await prisma.user.findUnique({ where: { username } });
		if (findUsername) {
			return ResponseUtils.sendMessage(userErr.usernameExists, req, res);
		}

		// Atualiza o nome de usuário
		await prisma.user.update({ where: { username: req.session.user.username }, data: { username: username } });
		req.session.user.username = username;

		ResponseUtils.sendMessage(userSuc.usernameUpdated, req, res);
	}

	static async updatePassword(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se há valores nos campos de senha vazios
		const { password, newPassword, newPasswordRepeat } = req.body;
		if (SystemUtils.isEmpty(password, newPassword, newPasswordRepeat)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Compara as 2 novas senhas enviadas
		if (!UserUtils.arePasswordsEqual(newPassword, newPasswordRepeat)) {
			return ResponseUtils.sendMessage(userErr.diffPasswords, req, res);
		}

		// Checa se a senha é forte
		if (!UserUtils.isPasswordValid(password)) {
			return ResponseUtils.sendMessage(userErr.passwordTooWeak, req, res);
		}

		// Compara a senha enviada com a senha no banco
		const findUser = await prisma.user.findUnique({ where: { email: req.session.user.email } });
		if (!findUser) {
			return ResponseUtils.sendMessage(userErr.userNotFound, req, res);
		}
		if (!UserUtils.isPasswordCorrect(password, findUser.password)) {
			return ResponseUtils.sendMessage(userErr.passwordWrong, req, res);
		}

		// Atualiza a senha
		await prisma.user.update({ where: { email: req.session.user.email }, data: { password: bcrypt.hashSync(newPassword, 10) } });
		ResponseUtils.sendMessage(userSuc.passwordUpdated, req, res);
	}

	static async deleteUser(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Apaga o usuário do banco
		await prisma.user.delete({ where: { email: req.session.user.email } });

		// Destroi a sessão, fazendo logout
		req.session.destroy((err) => {
			if (err) throw err;
		});

		ResponseUtils.sendMessage(userSuc.userDeleted, req, res);
	}
}
