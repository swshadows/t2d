export type UserRegisterReq = {
	email: string;
	username: string;
	password: string;
	passwordRepeat: string;
};

import UserAPI from "@/api/User.API";
import { Messages } from "./Response.utils";

const { error } = Messages.userMessages;

export default class UserUtils {
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

		// Em caso de erros, formata a resposta
		if (res.status != 200) {
			const { response } = res;
			return { message: response.data.error, code: "error" };
		}

		// Retorna o sucesso
		return { message: res.data.success, code: "success" };
	}
}
