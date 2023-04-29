export default class InvalidChecker {
	// Checa se algum dos argumentos passados estão vazios, retornando true caso algum esteja
	static isEmpty(...args: String[]): boolean {
		const arr: boolean[] = args.map((item) => {
			return !item ? true : false;
		});
		return arr.includes(true);
	}
}
