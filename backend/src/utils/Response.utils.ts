export const Messages = {
	// Mensagens do sistema
	systemMessages: {
		error: {
			emptyValues: {
				status: 400,
				json: {
					error: "Há valores vazios no corpo da requisição",
					code: "emptyValues",
				},
			},
			notAllowed: {
				status: 403,
				json: {
					error: "O usuário logado não tem permissão para acessar o conteudo",
					code: "notAllowed",
				},
			},
		},
	},

	// Mensagens do usuário
	userMessages: {
		error: {
			userNotFound: {
				status: 400,
				json: { error: "Usuário não encontrado", code: "userNotFound" },
			},
			invalidEmailRegex: {
				status: 400,
				json: { error: "O email enviado é invalido", code: "invalidEmailRegex" },
			},
			diffPasswords: {
				status: 400,
				json: { error: "As senhas não são iguais", code: "diffPasswords" },
			},
			emailExists: {
				status: 400,
				json: {
					error: "O email informado já está em uso",
					code: "emailExists",
				},
			},
			usernameExists: {
				status: 400,
				json: {
					error: "O nome de usuário informado já está em uso",
					code: "usernameExists",
				},
			},
			passwordTooWeak: {
				status: 400,
				json: {
					error: "A senha enviada é muito fraca, use simbolos e caracteres alfanuméricos maiúsculos e minusculos",
					code: "passwordTooWeak",
				},
			},
			alreadyLogged: {
				status: 400,
				json: {
					error: "Você já está logado",
					code: "alreadyLogged",
				},
			},
			notLoggedYet: {
				status: 400,
				json: {
					error: "Você ainda não fez login",
					code: "notLoggedYet",
				},
			},
			passwordWrong: {
				status: 400,
				json: {
					error: "A senha está incorreta",
					code: "passwordWrong",
				},
			},
		},
		success: {
			userCreated: {
				status: 200,
				json: {
					success: "Usuário criado com sucesso",
					code: "userCreated",
				},
			},
			userLogged: {
				status: 200,
				json: {
					success: "Usuário fez login com sucesso",
					code: "userLogged",
				},
			},
			userLogout: {
				status: 200,
				json: {
					success: "Usuário fez logout com sucesso",
					code: "userLogout",
				},
			},
			emailUpdated: {
				status: 200,
				json: {
					success: "Email atualizado com sucesso",
					code: "emailUpdated",
				},
			},
			usernameUpdated: {
				status: 200,
				json: {
					success: "Nome de usuário atualizado com sucesso",
					code: "usernameUpdated",
				},
			},
			passwordUpdated: {
				status: 200,
				json: {
					success: "Senha atualizada com sucesso",
					code: "passwordUpdated",
				},
			},
			userDeleted: {
				status: 200,
				json: {
					success: "Usuário apagado com sucesso",
					code: "userDeleted",
				},
			},
		},
	},

	// Mensagens do projeto
	projectMessages: {
		error: {
			projectsNotFound: {
				status: 404,
				json: {
					error: "Não há projetos cadastrados para o usuário logado",
					code: "projectsNotFound",
				},
			},
			notFound: {
				status: 404,
				json: {
					error: "Projeto requisitado não encontrado",
					code: "notFound",
				},
			},
			notOwner: {
				status: 403,
				json: {
					error: "O usuário logado não é dono do projeto",
					code: "notOwner",
				},
			},
			nameTooBig: {
				status: 400,
				json: {
					error: "O nome enviado ultrapassa o limite de 20 caracteres",
					code: "nameTooBig",
				},
			},
			descTooBig: {
				status: 400,
				json: {
					error: "A descrição enviada ultrapassa o limite de 50 caracteres",
					code: "descTooBig",
				},
			},
		},
		success: {
			projectCreated: {
				status: 200,
				json: {
					success: "Projeto criado com sucesso",
					code: "projectCreated",
				},
			},
			projectNameUpdated: {
				status: 200,
				json: {
					success: "Nome do projeto foi atualizado com sucesso",
					code: "projectNameUpdated",
				},
			},
			projectDescUpdated: {
				status: 200,
				json: {
					success: "Descrição do projeto foi atualizado com sucesso",
					code: "projectDescUpdated",
				},
			},
			projectDeleted: {
				status: 200,
				json: {
					success: "Projeto apagado com sucesso",
					code: "projectDeleted",
				},
			},
		},
	},

	// Mensagens do documento
	documentMessages: {
		error: {
			docNotFound: {
				status: 400,
				json: {
					error: "O documento requisitado não existe no projeto",
					code: "docNotFound",
				},
			},
			docsNotFound: {
				status: 400,
				json: {
					error: "Não existem documentos para o projeto solicitado",
					code: "docsNotFound",
				},
			},
			docIsntShared: {
				status: 400,
				json: {
					error: "O documento não está sendo compartilhado com ninguem, nada a remover",
					code: "docIsntShared",
				},
			},
			docsSharedNotFound: {
				status: 400,
				json: {
					error: "Não existem documentos compartilhados com o usuário",
					code: "docsSharedNotFound",
				},
			},
			cantShareWithSelf: {
				status: 400,
				json: {
					error: "Não é possivel compartilhar o documento consigo mesmo",
					code: "cantShareWithSelf",
				},
			},
			notOwner: {
				status: 403,
				json: {
					error: "O usuário logado não é dono do documento",
					code: "notOwner",
				},
			},
			contentFieldUndefined: {
				status: 500,
				json: {
					error: "O campo conteúdo deve ser enviado, mesmo estando vazio",
					code: "contentFieldUndefined",
				},
			},
			nameTooBig: {
				status: 400,
				json: {
					error: "O nome enviado ultrapassa o limite de 20 caracteres",
					code: "nameTooBig",
				},
			},
			descTooBig: {
				status: 400,
				json: {
					error: "A descrição enviada ultrapassa o limite de 50 caracteres",
					code: "descTooBig",
				},
			},
		},
		success: {
			documentCreated: {
				status: 200,
				json: {
					success: "Documento criado com sucesso",
					code: "documentCreated",
				},
			},
			documentShared: {
				status: 200,
				json: {
					success: "Documento compartilhado com sucesso",
					code: "documentShared",
				},
			},
			documentRevoked: {
				status: 200,
				json: {
					success: "Acesso ao documento foi revogado com sucesso",
					code: "documentRevoked",
				},
			},
			documentNameUpdated: {
				status: 200,
				json: {
					success: "Nome do documento foi atualizado com sucesso",
					code: "documentNameUpdated",
				},
			},
			documentDescUpdated: {
				status: 200,
				json: {
					success: "Descrição do documento foi atualizado com sucesso",
					code: "documentDescUpdated",
				},
			},
			documentDeleted: {
				status: 200,
				json: {
					success: "Documento foi deletado com sucesso",
					code: "documentDeleted",
				},
			},
			documentContentSaved: {
				status: 200,
				json: {
					success: "O conteúdo do documento foi salvo",
					code: "documentContentSaved",
				},
			},
		},
	},
};

import { Request, Response } from "express";
import { Message } from "../types/Message.type";

export default class ResponseUtils {
	// Envia uma resposta a requisição com uma mensagem padronizada
	static sendMessage(entry: Message, req: Request, res: Response) {
		res.status(entry.status).json(entry.json);
	}
}
