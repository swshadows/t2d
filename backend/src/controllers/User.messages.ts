const messages = {
	error: {
		userNotFound: {
			status: 400,
			json: { error: "Erro: Usuário não encontrado", code: "userNotFound" },
		},
		emptyValues: {
			status: 400,
			json: {
				error: "Erro: Há valores vazios no corpo da requisição",
				code: "emptyValues",
			},
		},
		invalidEmail: {
			status: 400,
			json: { error: "Erro: O email enviado é invalido", code: "invalidEmail" },
		},
		diffPasswords: {
			status: 400,
			json: { error: "Erro: As senhas não são iguais", code: "diffPasswords" },
		},
		emailExists: {
			status: 400,
			json: {
				error: "Erro: O email informado já está em uso",
				code: "emailExists",
			},
		},
		usernameExists: {
			status: 400,
			json: {
				error: "Erro: O nome de usuário informado já está em uso",
				code: "usernameExists",
			},
		},
		passwordTooWeak: {
			status: 400,
			json: {
				error: "Erro: A senha enviada é muito fraca, use simbolos e caracteres alfanuméricos maiúsculos e minusculos",
				code: "passwordTooWeak",
			},
		},
	},
	success: {
		userCreated: {
			status: 200,
			json: {
				success: "Successo: Usuário criado com sucesso",
				code: "userCreated",
			},
		},
	},
};
export default messages;
