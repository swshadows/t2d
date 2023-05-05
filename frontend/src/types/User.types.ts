export type UserRegisterReq = {
	email: string;
	username: string;
	password: string;
	passwordRepeat: string;
};

export type UserLoginReq = {
	login: string;
	password: string;
};

export type UserLogged = {
	id: number;
	username: string;
	email: string;
};

export type PasswordUpdate = {
	password: string;
	newPassword: string;
	newPasswordRepeat: string;
};
