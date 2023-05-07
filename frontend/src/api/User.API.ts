import { MessageSender, Messages } from "../utils/Response.utils";
import type { PasswordUpdate, UserLoginReq, UserRegisterReq } from "@/types/User.types";
import instance from "../utils/axios";

const { error } = Messages.userMessages;
const endpoint = "/user";

export default class UserAPI {
	static async updateSessionStatus() {
		// Faz a requisição ao backend
		try {
			const status = await instance.get(`${endpoint}`);
			return status.data;
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Valida o formulário de login
	static async validateUserLogin(user: UserLoginReq) {
		const { login, password } = user;
		if (!login) return error.missingLogindata; // Checa se foi informado um email ou username
		if (!password) return error.missingPassword; // Checa se a senha existe

		// Faz a requisição ao backend
		try {
			const response = await instance.post(`${endpoint}/login`, user);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Valida o formulário de registro
	static async validateUserRegister(user: UserRegisterReq) {
		const email = user.email.trim();
		const username = user.username.trim();
		const { password, passwordRepeat } = user;
		if (!email) return error.missingEmail; // Checa se email existe
		if (!username) return error.missingUsername; // Checa se o username existe
		if (!password) return error.missingPassword; // Checa se a senha existe
		if (!passwordRepeat) return error.missingPasswordRepeat; // Checa se a repetição da senha existe
		if (password != passwordRepeat) return error.diffPasswords; // Checa se as senhas são iguais

		// Valida o email com RegEx
		const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i;
		if (!emailRegex.test(email)) return error.invalidEmail;

		// Valida a senha com RegEx
		const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})/gm;
		if (!passwordRegex.test(password)) return error.invalidPassword;

		// Faz a requisição ao backend
		try {
			const response = await instance.post(`${endpoint}/register`, user);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Atualiza o email
	static async updateEmail(email: string) {
		email = email.trim();
		if (!email) return error.missingEmail;

		// Valida o email com RegEx
		const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i;
		if (!emailRegex.test(email)) return error.invalidEmail;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateEmail`, { email });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Atualiza o nome de usuário
	static async updateUsername(username: string) {
		username = username.trim();
		if (!username) return error.missingUsername;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateUsername`, { username });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Atualiza senha
	static async updatePassword(passwords: PasswordUpdate) {
		const { password, newPassword, newPasswordRepeat } = passwords;
		if (!password || !newPassword) return error.missingPassword;
		if (!newPasswordRepeat) return error.missingPasswordRepeat;
		if (newPassword != newPasswordRepeat) return error.diffPasswords;

		// Valida a senha com RegEx
		const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})/gm;
		if (!passwordRegex.test(newPassword)) return error.invalidPassword;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updatePassword`, passwords);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Deleta usuário
	static async deleteUser() {
		// Faz a requisição ao backend
		try {
			const response = await instance.delete(`${endpoint}/delete`);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Realiza o logout
	static async logoutUser() {
		// Faz a requisição ao backend
		try {
			const response = await instance.post(`${endpoint}/logout`);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}
}
