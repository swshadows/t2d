import "express-session";

declare module "express-session" {
	export interface SessionData {
		user: { id: number; email: string; username: string };
	}
}
