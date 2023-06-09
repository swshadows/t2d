import { PrismaClient } from "@prisma/client";
import { User } from "../types/Session.type";

export default class DocumentUtils {
	// Checa se o documento existe em determinado projeto
	static async documentExists(projectId: number, documentId: number, prisma: PrismaClient) {
		const doc = await prisma.document.findFirst({ where: { AND: [{ projectId: Number(projectId) }, { id: documentId }] } });
		if (!doc) return false;
		else return doc;
	}

	// Checa se o usuário logado é dono do documento ou se está sendo compartilhado com o mesmo @description
	static async documentIsSharedOrOwned(user: User, projectId: number, documentId: number, prisma: PrismaClient) {
		const sharedUser = await prisma.document.findFirst({ where: { AND: [{ sharedUserId: user.id }, { id: documentId }] } });
		const projectOwner = await prisma.project.findFirst({ where: { AND: [{ userId: user.id }, { id: projectId }] } });
		if (projectOwner || sharedUser) return true;
		else return false;
	}

	// Checa se o nome enviado tem mais que 20 caracteres
	static isNameTooBig(name: string) {
		return name.length > 20;
	}

	// Checa se a descrição enviada tem mais que 50 caracteres
	static isDescTooBig(desc: string) {
		return desc.length > 50;
	}
}
