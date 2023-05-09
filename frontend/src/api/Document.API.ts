import { Messages, MessageSender } from "@/utils/Response.utils";
import type { DocumentCreate } from "@/types/Document.types";
import instance from "@/utils/axios";

const { error } = Messages.documentMessages;

const endpoint = "/doc";

export default class DocumentAPI {
	// Pega todos os documentos do projeto com ID passado dinamicamente pela view do usuário logado
	static async getDocuments(projectId: number) {
		// Faz a requisição ao backend
		try {
			const docs = await instance.get(`${endpoint}/${projectId}`);
			return docs.data;
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Pega informações do projeto atual
	static async getCurrentProject(projectId: number) {
		// Faz a requisição ao backend
		try {
			const docs = await instance.get(`${endpoint}/one/${projectId}`);
			return docs.data;
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Cria documento ao projeto com ID passado dinamicamente pela view ao usuário logado
	static async createDocument(projectId: number, doc: DocumentCreate) {
		const name = doc.name.trim();
		const desc = doc.desc.trim();

		if (!name) return error.missingName;
		if (!desc) return error.missingDesc;
		if (name.length > 20) return error.nameTooBig;
		if (desc.length > 50) return error.descTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.post(`${endpoint}/create`, { name, desc, projectId });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Atualiza o nome do documento passando o ID do documento e confirmando o dono com o ID do projeto
	static async updateName(name: string, projectId: number, documentId: number) {
		name = name.trim();
		if (!name) return error.missingName;
		if (name.length > 20) return error.nameTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateName`, { name, projectId, documentId });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Atualiza a descrição do documento passando o ID do documento e confirmando o dono com o ID do projeto
	static async updateDescription(desc: string, projectId: number, documentId: number) {
		desc = desc.trim();
		if (!desc) return error.missingDesc;
		if (desc.length > 50) return error.descTooBig;

		// Faz a requisição ao backend
		try {
			const response = await instance.put(`${endpoint}/updateDescription`, { desc, projectId, documentId });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}

	// Deleta um documento passando o ID do documento e confirmando o dono com o ID do projeto
	static async deleteDocument(projectId: number, documentId: number) {
		// Faz a requisição ao backend
		try {
			const response = await instance.delete(`${endpoint}/delete`, { data: { projectId, documentId } });
			return MessageSender.returnMessage(response.data);
		} catch (error: any) {
			return MessageSender.returnMessage(error.response);
		}
	}
}
