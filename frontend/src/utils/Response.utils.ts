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
	},
	projectMessages: {
		error: {
			missingName: {
				message: "O nome do projeto não foi preenchido",
				code: "error"
			},
			missingDesc: {
				message: "A descrição do projeto não foi preenchida",
				code: "error"
			},
			nameTooBig: {
				message: "O nome tem mais que 20 caracteres",
				code: "error"
			},
			descTooBig: {
				message: "A descrição tem mais que 50 caracteres",
				code: "error"
			}
		}
	},
	documentMessages: {
		error: {
			missingName: {
				message: "O nome do documento não foi preenchido",
				code: "error"
			},
			missingDesc: {
				message: "A descrição do documento não foi preenchida",
				code: "error"
			},
			nameTooBig: {
				message: "O nome tem mais que 20 caracteres",
				code: "error"
			},
			descTooBig: {
				message: "A descrição tem mais que 50 caracteres",
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
			return { message: res.data.error, code: "error", apiCode: res.data.code, status: res.status };
		}
		// Retorna o sucesso
		return { message: res.success, code: "success", apiCode: res.code };
	}
}
