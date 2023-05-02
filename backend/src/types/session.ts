import "express-session";

declare module "express-session" {
	export interface SessionData {
		user: User;
	}
}

export type User = {
	id: number;
	email: string;
	username: string;
};
