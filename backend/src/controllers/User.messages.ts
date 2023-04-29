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
		invalidEmailRegex: {
			status: 400,
			json: { error: "Erro: O email enviado é invalido", code: "invalidEmailRegex" },
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
		alreadyLogged: {
			status: 400,
			json: {
				error: "Erro: Você já está logado",
				code: "alreadyLogged",
			},
		},
		notLoggedYet: {
			status: 400,
			json: {
				error: "Erro: Você ainda não fez login",
				code: "notLoggedYet",
			},
		},
		passwordWrong: {
			status: 400,
			json: {
				error: "Erro: A senha está incorreta",
				code: "passwordWrong",
			},
		},
	},

	success: {
		userCreated: {
			status: 200,
			json: {
				success: "Sucesso: Usuário criado com sucesso",
				code: "userCreated",
			},
		},
		userLogged: {
			status: 200,
			json: {
				success: "Sucesso: Usuário fez login com sucesso",
				code: "userLogged",
			},
		},
		userLogout: {
			status: 200,
			json: {
				success: "Sucesso: Usuário fez logout com sucesso",
				code: "userLogout",
			},
		},
		emailUpdated: {
			status: 200,
			json: {
				success: "Sucesso: Email atualizado com sucesso",
				code: "emailUpdated",
			},
		},
		usernameUpdated: {
			status: 200,
			json: {
				success: "Sucesso: Nome de usuário atualizado com sucesso",
				code: "usernameUpdated",
			},
		},
		passwordUpdated: {
			status: 200,
			json: {
				success: "Sucesso: Senha atualizada com sucesso",
				code: "passwordUpdated",
			},
		},
		userDeleted: {
			status: 200,
			json: {
				success: "Sucesso: Usuário apagado com sucesso",
				code: "userDeleted",
			},
		},
	},
};
export default messages;
