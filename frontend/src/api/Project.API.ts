import type { ProjectCreate } from "@/types/Project.types";
import instance from "@/utils/axios";

const endpoint = "/project";

export default class ProjectAPI {
	// Pega todos os projetos do usuário logado
	static async getProjects() {
		try {
			const projects = await instance.get(`${endpoint}/logged`);
			return projects.data;
		} catch (error: any) {
			return error.response;
		}
	}

	// Cria projeto no banco ao usuário logado
	static async createProject(project: ProjectCreate) {
		try {
			const response = await instance.post(`${endpoint}/create`, project);
			return response.data;
		} catch (error: any) {
			return error.response;
		}
	}
}
