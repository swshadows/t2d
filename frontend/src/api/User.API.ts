import type { UserRegisterReq } from "@/utils/User.utils";
import instance from "@/utils/axios";
import type { AxiosError, AxiosResponse } from "axios";

export default class UserAPI {
	static async getUser(username: string) {
		const response = await instance.get(`/user/${username}`);
		return response;
	}

	static async registerUser(user: UserRegisterReq): Promise<any> {
		try {
			const data = await instance.post("/user/register", user);
			return data;
		} catch (error: any) {
			return error;
		}
	}
}
