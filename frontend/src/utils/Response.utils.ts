export const Messages = {
	userMessages: {
		error: {
			missingEmail: {
				message: "O email não foi preenchido",
				code: "error"
			},
			missingLogindata: {
				message: "O campo de login não foi preenchido",
				code: "error"
			},
			missingUsername: {
				message: "O nome de usuário não foi preenchido",
				code: "error"
			},
			missingPassword: {
				message: "A senha não foi preenchida",
				code: "error"
			},
			missingPasswordRepeat: {
				message: "A repetição da senha não foi preenchida",
				code: "error"
			},
			diffPasswords: {
				message: "As senhas são diferentes",
				code: "error"
			},
			invalidEmail: {
				message: "O email é inválido",
				code: "error"
			},
			invalidPassword: {
				message: "A senha é muito fraca, use uma senha com mais que 8 simbolos e caracteres alfanuméricos maiúsculos e minusculos",
				code: "error"
			}
		}
	}
};

export type MessageType = {
	message: string;
	code: "error" | "success";
};

export class MessageSender {
	static returnMessage(res: any) {
		if (res.status && res.status != 200) {
			// Em caso de erros, retorna o erro
			return { message: res.data.error, code: "error" };
		}
		// Retorna o sucesso
		return { message: res.success, code: "success" };
	}
}
