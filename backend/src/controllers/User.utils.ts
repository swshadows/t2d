import { Request } from "express";
import bcrypt from "bcrypt";

export default class UserUtils {
	// Checa se o regex de email está correto
	static regexEmail(email: string): boolean {
		const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i;
		return regex.test(email);
	}

	// Checa se a senha é forte usando regex
	static regexPassword(password: string): boolean {
		const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})/gm;
		return regex.test(password);
	}

	// Checa se a senha é igual a sua repetição
	static passwordCompare(first: string, second: string): boolean {
		return first == second;
	}

	// Checa se senha enviada é a mesma guardada, usando dehash
	static passwordDehash(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}

	// Checa se o usuário está logado ou não
	static isLogged(req: Request): boolean {
		return req.session.user ? true : false;
	}
}
