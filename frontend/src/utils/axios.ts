import axios from "axios";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	responseType: "json",
	responseEncoding: "utf8",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json;charset=UTF-8"
	}
});

export default instance;
