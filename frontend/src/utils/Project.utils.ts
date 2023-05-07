import ProjectAPI from "@/api/Project.API";
import { Messages, MessageSender } from "./Response.utils";
import type { ProjectCreate } from "@/types/Project.types";

const { error } = Messages.projectMessages;

export default class ProjectUtils {
	static async getProjects() {
		const res = await ProjectAPI.getProjects();
		if (res.status && res.status != 200) {
			return MessageSender.returnMessage(res);
		}

		return res;
	}

	static async createProject(project: ProjectCreate) {
		const name = project.name.trim();
		const desc = project.desc.trim();

		if (!name) return error.missingName;
		if (!desc) return error.missingDesc;
		if (name.length > 20 || desc.length > 20) return error.fieldTooLarge;

		const res = await ProjectAPI.createProject({ name, desc });
		return MessageSender.returnMessage(res);
	}
}
