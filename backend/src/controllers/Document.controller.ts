import { Request, Response, response } from "express";
import ResponseSender from "../utils/responseSender";
import { Document } from "@prisma/client";
import { documentMessages, projectMessages, systemMessages, userMessages } from "../utils/messages";
import InvalidChecker from "../utils/invalidChecker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const { error: userErr } = userMessages;
const { error: sysErr } = systemMessages;
const { error: projErr } = projectMessages;
const { error: docErr, success: docSuc } = documentMessages;

export default class DocumentController {
	static async createDocument(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o nome, descrição e ID está vazio
		const { name, desc, projectId } = req.body;
		if (InvalidChecker.isEmpty(name, desc, projectId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: projectId }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Adiciona documento ao banco
		await prisma.project.update({
			where: { id: projectId },
			data: {
				docs: { create: { name, desc } },
			},
		});

		ResponseSender.sendMessage(docSuc.documentCreated, req, res);
	}

	static async getProjectDocs(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o ID do projeto foi informado no req.param
		const { projectId } = req.params;
		if (!projectId) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se existem documentos no projeto
		const docs = await prisma.document.findMany({ where: { projectId: Number(projectId) }, select: { id: true, name: true, desc: true } });
		if (!docs || !docs.length) {
			return ResponseSender.sendMessage(docErr.docsNotFound, req, res);
		}

		res.status(200).json(docs);
	}

	static async getSharedDocs(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Procura documentos compartilhados com o usuário logado
		const docs = await prisma.$queryRaw<Document[]>`
			SELECT d.id as docId, d.name as docName, d.desc as docDesc, p.name as projectName, p.desc as projectDesc, u.username as projectOwner FROM document d
			INNER JOIN project p ON d.projectId = p.id
			INNER JOIN user u ON p.userId = u.id WHERE sharedUserId = ${req.session.user.id}`;
		if (!docs || !docs.length) {
			return ResponseSender.sendMessage(docErr.docsSharedNotFound, req, res);
		}

		res.status(200).json(docs);
	}

	static async shareDoc(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado um nome de usuário e IDs
		const { username, projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(username, projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Checa se o usuário enviado é diferente do logado
		if (req.session.user.username == username) {
			return ResponseSender.sendMessage(docErr.cantShareWithSelf, req, res);
		}

		// Verifica se o usuário existe
		const user = await prisma.user.findUnique({ where: { username } });
		if (!user) {
			return ResponseSender.sendMessage(userErr.userNotFound, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Remove o acesso ao usuário para transferir para o outro
		if (doc.sharedUserId) {
			await prisma.user.update({
				where: { id: doc.sharedUserId },
				data: {
					sharedDocuments: {
						disconnect: { id: doc.id },
					},
				},
			});
		}

		// Adiciona acesso ao documento
		await prisma.user.update({
			where: { username },
			data: {
				sharedDocuments: {
					connect: { id: documentId },
				},
			},
		});

		ResponseSender.sendMessage(docSuc.documentShared, req, res);
	}

	static async removeShare(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Verifica se o documento está sendo realmente compartilhado com alguém
		if (!doc.sharedUserId) {
			return ResponseSender.sendMessage(docErr.docIsntShared, req, res);
		}

		// Remove o acesso
		await prisma.user.update({
			where: { id: doc.sharedUserId },
			data: {
				sharedDocuments: {
					disconnect: { id: doc.id },
				},
			},
		});

		ResponseSender.sendMessage(docSuc.documentRevoked, req, res);
	}

	static async updateName(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado o nome novo e IDs
		const { name, projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(name, projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Atualiza o nome do documento
		await prisma.project.update({
			where: { id: projectId },
			data: { docs: { update: { where: { id: documentId }, data: { name } } } },
		});

		ResponseSender.sendMessage(docSuc.documentNameUpdated, req, res);
	}

	static async updateDescription(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado a descrição nova e IDs
		const { desc, projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(desc, projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Atualiza a descrição do documento
		await prisma.project.update({
			where: { id: projectId },
			data: { docs: { update: { where: { id: documentId }, data: { desc } } } },
		});

		ResponseSender.sendMessage(docSuc.documentDescUpdated, req, res);
	}

	static async deleteDocument(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Deleta o documento
		await prisma.project.update({
			where: { id: projectId },
			data: { docs: { delete: { id: documentId } } },
		});

		ResponseSender.sendMessage(docSuc.documentDeleted, req, res);
	}

	static async docGetContent(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.params;
		if (InvalidChecker.isEmpty(projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o documento pertence ao usuário compartilhado OU se o projeto pertence ao usuário logado, para dar permissões
		const shared = await prisma.document.findFirst({ where: { AND: [{ sharedUserId: req.session.user.id }, { id: Number(documentId) }] } });
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project && !shared) {
			return ResponseSender.sendMessage(sysErr.notAllowed, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: Number(documentId) }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		res.status(200).json(doc);
	}

	static async docSaveContent(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { content, projectId, documentId } = req.body;
		if (InvalidChecker.isEmpty(projectId, documentId)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se content existe, levando em consideração o seu tamanho 0, sendo opcional
		if (content == undefined) {
			return ResponseSender.sendMessage(docErr.contentFieldUndefined, req, res);
		}

		// Verifica se o documento pertence ao usuário compartilhado OU se o projeto pertence ao usuário logado, para dar permissões
		const shared = await prisma.document.findFirst({ where: { AND: [{ sharedUserId: req.session.user.id }, { id: Number(documentId) }] } });
		const project = await prisma.project.findFirst({ where: { AND: [{ userId: req.session.user.id }, { id: Number(projectId) }] } });
		if (!project && !shared) {
			return ResponseSender.sendMessage(sysErr.notAllowed, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: Number(documentId) }] } });
		if (!doc) {
			return ResponseSender.sendMessage(docErr.docNotFound, req, res);
		}

		// Pega o conteudo e atualiza
		await prisma.document.update({ where: { id: projectId }, data: { content } });

		ResponseSender.sendMessage(docSuc.documentContentSaved, req, res);
	}
}
