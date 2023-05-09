import { PrismaClient } from "@prisma/client";
import { User } from "../types/Session.type";

export default class ProjectUtils {
	// Checa se o usuário logado é o dono do projeto
	static async isUserOwner(user: User, projectId: number, prisma: PrismaClient) {
		const findProject = await prisma.project.findFirst({ where: { AND: [{ userId: user.id }, { id: projectId }] } });
		if (!findProject) {
			return false;
		} else return findProject;
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
