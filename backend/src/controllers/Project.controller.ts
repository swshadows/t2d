import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ResponseSender from "../utils/ResponseSender";
import { projectMessages, systemMessages, userMessages } from "../utils/Messages";
import SystemUtils from "../utils/System.utils";
import ProjectUtils from "../utils/Project.utils";

const prisma = new PrismaClient();

const { error: projErr, success: projSuc } = projectMessages;
const { error: userErr } = userMessages;
const { error: sysErr } = systemMessages;

export default class ProjectController {
	static async getUserProjects(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o usuário tem projetos
		const projects = await prisma.project.findMany({ where: { userId: req.session.user.id }, select: { id: true, name: true, desc: true } });
		if (!projects || !projects.length) {
			return ResponseSender.sendMessage(projErr.projectsNotFound, req, res);
		}

		// Retorna os projetos do usuário
		res.status(200).json(projects);
	}

	static async createProject(req: Request, res: Response) {
		// Checa se o usuário tem permissão de criar um projeto, ou seja, se está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se os dados enviados estão vazios
		const { name, desc } = req.body;
		if (SystemUtils.isEmpty(name, desc)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Cria um projeto para o usuário
		await prisma.user.update({
			where: { id: req.session.user.id },
			data: {
				projects: {
					create: {
						name,
						desc,
					},
				},
			},
		});

		ResponseSender.sendMessage(projSuc.projectCreated, req, res);
	}

	static async updateName(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o nome e ID está vazio
		const { name, id } = req.body;
		if (SystemUtils.isEmpty(name, id)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const isOwner = await ProjectUtils.isUserOwner(req.session.user, id, prisma);
		if (!isOwner) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Atualiza o nome do projeto
		await prisma.user.update({
			where: { id: req.session.user.id },
			data: {
				projects: {
					update: {
						where: { id },
						data: { name },
					},
				},
			},
		});

		ResponseSender.sendMessage(projSuc.projectNameUpdated, req, res);
	}

	static async updateDescription(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se a descrição e ID está vazio
		const { desc, id } = req.body;
		if (SystemUtils.isEmpty(desc, id)) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e edição de projetos alheios
		const isOwner = await ProjectUtils.isUserOwner(req.session.user, id, prisma);
		if (!isOwner) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		// Atualiza o nome do projeto
		await prisma.user.update({
			where: { id: req.session.user.id },
			data: {
				projects: {
					update: {
						where: { id },
						data: { desc },
					},
				},
			},
		});

		ResponseSender.sendMessage(projSuc.projectDescUpdated, req, res);
	}

	static async deleteProject(req: Request, res: Response) {
		// Checa se o usuário está logado
		if (!req.session.user) {
			return ResponseSender.sendMessage(userErr.notLoggedYet, req, res);
		}

		// Checa se o ID do projeto está vazio
		const { id } = req.body;
		if (!id) {
			return ResponseSender.sendMessage(sysErr.emptyValues, req, res);
		}

		// Verifica se o projeto é do usuário logado, para evitar erros de inexistência e deleção de projetos alheios
		const isOwner = await ProjectUtils.isUserOwner(req.session.user, id, prisma);
		if (!isOwner) {
			return ResponseSender.sendMessage(projErr.notOwner, req, res);
		}

		await prisma.user.update({
			where: { id: req.session.user.id },
			data: {
				projects: {
					delete: {
						id,
					},
				},
			},
		});

		ResponseSender.sendMessage(projSuc.projectDeleted, req, res);
	}
}
