import { Request, Response } from "express";

import ResponseUtils, { Messages } from "../utils/Response.utils";
import SystemUtils from "../utils/System.utils";
import ProjectUtils from "../utils/Project.utils";
import DocumentUtils from "../utils/Document.utils";

import { Document, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const { error: userErr } = Messages.userMessages;
const { error: sysErr } = Messages.systemMessages;
const { error: projErr } = Messages.projectMessages;
const { error: docErr, success: docSuc } = Messages.documentMessages;

export default class DocumentController {
	static async createDocument(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o nome, descrição e ID está vazio
		const { name, desc, projectId } = req.body;
		if (SystemUtils.isEmpty(name, desc, projectId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o nome enviado é maior que 20 caracteres
		if (DocumentUtils.isNameTooBig(name)) {
			return ResponseUtils.sendMessage(docErr.nameTooBig, req, res);
		}

		// Verifica se a descrição enviada é maior que 50 caracteres
		if (DocumentUtils.isDescTooBig(desc)) {
			return ResponseUtils.sendMessage(docErr.descTooBig, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Adiciona documento ao banco
		await prisma.project.update({
			where: { id: project.id },
			data: {
				docs: { create: { name, desc } },
			},
		});

		ResponseUtils.sendMessage(docSuc.documentCreated, req, res);
	}

	static async getProjectDocs(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o ID do projeto foi informado no req.param
		const { projectId } = req.params;
		const id = Number(projectId);
		if (!id) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, id, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se existem documentos no projeto
		const docs = await prisma.document.findMany({ where: { projectId: id }, select: { id: true, name: true, desc: true, sharedUserId: true } });
		if (!docs || !docs.length) {
			return ResponseUtils.sendMessage(docErr.docsNotFound, req, res);
		}

		res.status(200).json(docs);
	}

	static async getSharedDocs(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Procura documentos compartilhados com o usuário logado
		const docs = await prisma.$queryRaw<Document[]>`
			SELECT d.id as docId, d.name as docName, d.desc as docDesc, p.id as projectId, p.name as projectName, p.desc as projectDesc, u.username as projectOwner FROM document d
			INNER JOIN project p ON d.projectId = p.id
			INNER JOIN user u ON p.userId = u.id WHERE sharedUserId = ${req.session.user.id}`;
		if (!docs || !docs.length) {
			return ResponseUtils.sendMessage(docErr.docsSharedNotFound, req, res);
		}

		res.status(200).json(docs);
	}

	static async shareDoc(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado um nome de usuário e IDs
		const { username, projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(username, projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Checa se o usuário enviado é diferente do logado
		if (req.session.user.username.toLowerCase() == username.toLowerCase()) {
			return ResponseUtils.sendMessage(docErr.cantShareWithSelf, req, res);
		}

		// Verifica se o usuário existe
		const user = await prisma.user.findUnique({ where: { username } });
		if (!user) {
			return ResponseUtils.sendMessage(userErr.userNotFound, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
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

		ResponseUtils.sendMessage(docSuc.documentShared, req, res);
	}

	static async removeShare(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		// Verifica se o documento está sendo realmente compartilhado com alguém
		if (!doc.sharedUserId) {
			return ResponseUtils.sendMessage(docErr.docIsntShared, req, res);
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

		ResponseUtils.sendMessage(docSuc.documentRevoked, req, res);
	}

	static async updateName(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado o nome novo e IDs
		const { name, projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(name, projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o nome enviado é maior que 20 caracteres
		if (DocumentUtils.isNameTooBig(name)) {
			return ResponseUtils.sendMessage(docErr.nameTooBig, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		// Atualiza o nome do documento
		await prisma.project.update({
			where: { id: project.id },
			data: { docs: { update: { where: { id: doc.id }, data: { name } } } },
		});

		ResponseUtils.sendMessage(docSuc.documentNameUpdated, req, res);
	}

	static async updateDescription(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado a descrição nova e IDs
		const { desc, projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(desc, projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se a descrição enviada é maior que 50 caracteres
		if (DocumentUtils.isDescTooBig(desc)) {
			return ResponseUtils.sendMessage(docErr.descTooBig, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		// Atualiza a descrição do documento
		await prisma.project.update({
			where: { id: project.id },
			data: { docs: { update: { where: { id: doc.id }, data: { desc } } } },
		});

		ResponseUtils.sendMessage(docSuc.documentDescUpdated, req, res);
	}

	static async deleteDocument(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const project = await ProjectUtils.isUserOwner(req.session.user, projectId, prisma);
		if (!project) {
			return ResponseUtils.sendMessage(projErr.notOwner, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		// Deleta o documento
		await prisma.project.update({
			where: { id: project.id },
			data: { docs: { delete: { id: doc.id } } },
		});

		ResponseUtils.sendMessage(docSuc.documentDeleted, req, res);
	}

	static async docGetContent(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { projectId, documentId } = req.params;
		const projId = Number(projectId);
		const docId = Number(documentId);
		if (SystemUtils.isEmpty(projId, docId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o documento pertence ao usuário compartilhado OU se o projeto pertence ao usuário logado, para dar permissões
		const perms = await DocumentUtils.documentIsSharedOrOwned(req.session.user, projId, docId, prisma);
		if (!perms) {
			return ResponseUtils.sendMessage(sysErr.notAllowed, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projId, docId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		res.status(200).json(doc);
	}

	static async docSaveContent(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseUtils.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Verifica se foi enviado os IDs
		const { content, projectId, documentId } = req.body;
		if (SystemUtils.isEmpty(projectId, documentId)) {
			return ResponseUtils.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se content existe, levando em consideração o seu tamanho 0, sendo opcional
		if (content == undefined) {
			return ResponseUtils.sendMessage(docErr.contentFieldUndefined, req, res);
		}

		// Verifica se o documento pertence ao usuário compartilhado OU se o projeto pertence ao usuário logado, para dar permissões
		const perms = await DocumentUtils.documentIsSharedOrOwned(req.session.user, projectId, documentId, prisma);
		if (!perms) {
			return ResponseUtils.sendMessage(sysErr.notAllowed, req, res);
		}

		// Verifica se o documento requisitado existe no projeto
		const doc = await DocumentUtils.documentExists(projectId, documentId, prisma);
		if (!doc) {
			return ResponseUtils.sendMessage(docErr.docNotFound, req, res);
		}

		// Pega o conteudo e atualiza
		await prisma.document.update({ where: { id: doc.id }, data: { content } });

		ResponseUtils.sendMessage(docSuc.documentContentSaved, req, res);
	}
}
