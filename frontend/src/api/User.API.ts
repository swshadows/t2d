import type { PasswordUpdate, UserLoginReq, UserRegisterReq } from "@/types/User.types";
import instance from "@/utils/axios";

export default class UserAPI {
	// Faz uma requisição de estado da sessão
	static async getSessionStatus() {
		try {
			const status = await instance.get("/user");
			return status.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Faz o login com os dados do formulário
	static async loginUser(user: UserLoginReq) {
		try {
			const response = await instance.post("/user/login", user);
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Pega usuário do banco de dados
	static async getUser(username: string) {
		const response = await instance.get(`/user/${username}`);
		return response;
	}

	// Registra usuário com dados do formulário
	static async registerUser(user: UserRegisterReq) {
		try {
			const response = await instance.post("/user/register", user);
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Realiza atualização de email com dados do formulário para usuário logado
	static async updateEmail(email: string) {
		try {
			const response = await instance.put("/user/updateEmail", { email });
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Realiza atualização de nome de usuário com dados do formulário para usuário logado
	static async updateUsername(username: string) {
		try {
			const response = await instance.put("/user/updateUsername", { username });
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Realiza atualização de senha com dados do formulário para usuário logado
	static async updatePassword(passwords: PasswordUpdate) {
		try {
			const response = await instance.put("/user/updatePassword", passwords);
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Realiza deleção do usuário
	static async deleteUser() {
		try {
			const response = await instance.delete("/user/delete");
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Realiza logout do usuário logado, com desvinculo de sessão
	static async logoutUser() {
		try {
			const response = await instance.post("/user/logout");
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}
}
