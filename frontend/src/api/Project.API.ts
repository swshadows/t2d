import { Messages, MessageSender } from "@/utils/Response.utils";
import type { ProjectCreate } from "@/types/Project.types";
import instance from "@/utils/axios";

const { error } = Messages.projectMessages;

const endpoint = "/project";

export default class ProjectAPI {
	// Pega todos os projetos do usuário logado
	static async getProjects() {
		// Faz a requisição ao backend
		try {
			const projects = await instance.get(`${endpoint}/logged`);
			return projects.data;
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	static async getOneProject(projectId: number) {
		// Faz a requisição ao backend
		try {
			const projects = await instance.get(`${endpoint}/${projectId}`);
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
		if (name.length > 20) return error.nameTooBig;
		if (desc.length > 50) return error.descTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.post(`${endpoint}/create`, project);
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Edita o nome do projeto
	static async updateName(name: string, id: number) {
		name = name.trim();
		if (!name) return error.missingName;
		if (name.length > 20) return error.nameTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateName`, { name, id });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Edita a descrição do projeto
	static async updateDescription(desc: string, id: number) {
		desc = desc.trim();
		if (!desc) return error.missingDesc;
		if (desc.length > 50) return error.descTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateDescription`, { desc, id });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Deleta um projeto
	static async deleteProject(id: number) {
		// Faz a requisição ao backend
		try {
			const response = await instance.delete(`${endpoint}/delete`, { data: { id } });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}
}
