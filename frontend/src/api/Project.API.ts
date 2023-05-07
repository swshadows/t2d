import { Messages, MessageSender } from "@/utils/Response.utils";
import type { ProjectCreate } from "@/types/Project.types";
import instance from "@/utils/axios";

const { error } = Messages.projectMessages;

const endpoint = "/project";

export default class ProjectUtils {
	// Pega todos os projetos do usuário logado
	static async getProjects() {
		try {
			const projects = await instance.get(`${endpoint}/logged`);
			return projects.data;
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Cria projeto no banco ao usuário logado
	static async createProject(project: ProjectCreate) {
		const name = project.name.trim();
		const desc = project.desc.trim();

		if (!name) return error.missingName;
		if (!desc) return error.missingDesc;
		if (name.length > 20 || desc.length > 20) return error.fieldTooLarge;

		try {
			const response = await instance.post(`${endpoint}/create`, project);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}
}
