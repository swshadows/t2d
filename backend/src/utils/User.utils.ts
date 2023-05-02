import bcrypt from "bcrypt";

export default class UserUtils {
	// Checa se o regex de email está correto
	static isEmailValid(email: string): boolean {
		const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i;
		return regex.test(email);
	}

	// Checa se a senha é forte usando regex
	static isPasswordValid(password: string): boolean {
		const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})/gm;
		return regex.test(password);
	}

	// Checa se a senha é igual a sua repetição
	static arePasswordsEqual(first: string, second: string): boolean {
		return first == second;
	}

	// Checa se senha enviada é a mesma guardada, usando dehash
	static isPasswordCorrect(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}
}
