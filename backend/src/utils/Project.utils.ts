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

	// Checa se o item enviado tem mais que 20 caracteres
	static isTheFieldTooBig(...fields: string[]) {
		const arr = fields.map((item) => {
			return item.length > 20;
		});
		return arr.includes(true);
	}
}
