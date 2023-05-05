import UserAPI from "@/api/User.API";
import { MessageSender, Messages } from "./Response.utils";
import type { PasswordUpdate, UserLoginReq, UserRegisterReq } from "@/types/User.types";
import { loggedUserStore } from "@/stores/User.store";

const { error } = Messages.userMessages;

const userStore = loggedUserStore();

export default class UserUtils {
	static async updateSessionStatus() {
		const res = await UserAPI.getSessionStatus();
		if (res.status && res.status != 200) {
			return res;
		}

		userStore.storeLogin(res);
	}
	static async validateUserLogin(user: UserLoginReq) {
		const { login, password } = user;
		if (!login) return error.missingLogindata; // Checa se foi informado um email ou username
		if (!password) return error.missingPassword; // Checa se a senha existe

		const res = await UserAPI.loginUser(user);
		// Formata a mensagem de erro ou sucesso
		return MessageSender.returnMessage(res);
	}

	static async validateUserRegister(user: UserRegisterReq) {
		const { email, username, password, passwordRepeat } = user;
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
		const res = await UserAPI.registerUser(user);

		// Em caso de erros, retorna o erro
		if (res.status && res.status != 200) {
			return { message: res.data.error, code: "error" };
		}

		// Retorna o sucesso
		return { message: res.success, code: "success" };
	}

	static async updateEmail(email: string) {
		email = email.trim();
		if (!email) return error.missingEmail;

		// Valida o email com RegEx
		const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i;
		if (!emailRegex.test(email)) return error.invalidEmail;

		// Faz a requisição ao backend
		const res = await UserAPI.updateEmail(email);

		// Formata a mensagem de erro ou sucesso
		return MessageSender.returnMessage(res);
	}

	static async updateUsername(username: string) {
		username = username.trim();
		if (!username) return error.missingUsername;

		// Faz a requisição ao backend
		const res = await UserAPI.updateUsername(username);

		// Formata a mensagem de erro ou sucesso
		return MessageSender.returnMessage(res);
	}

	static async updatePassword(passwords: PasswordUpdate) {
		const { password, newPassword, newPasswordRepeat } = passwords;
		if (!password || !newPassword) return error.missingPassword;
		if (!newPasswordRepeat) return error.missingPasswordRepeat;
		if (newPassword != newPasswordRepeat) return error.diffPasswords;

		// Valida a senha com RegEx
		const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})/gm;
		if (!passwordRegex.test(newPassword)) return error.invalidPassword;

		// Faz a requisição ao backend
		const res = await UserAPI.updatePassword(passwords);

		// Formata a mensagem de erro ou sucesso
		return MessageSender.returnMessage(res);
	}

	static async deleteUser() {
		// Faz a requisição ao backend
		const res = await UserAPI.deleteUser();

		// Formata a mensagem de erro ou sucesso
		return MessageSender.returnMessage(res);
	}
}
