import { IKResult } from "../types/IKResult";
import axios from "../../modules/axios";

export default class Api {

    /**
     * 
     * @param url 
     * @description Axios Get 
     * @returns Promise<IKResult<T>>
     */
    static async getResult<T>(url: string,): Promise<IKResult<T>> {

        let result = {} as IKResult<T>

        await axios.get(url).then((r) => {

            result = r.data

        }).catch((e) => {
            result.succeeded = false
            result.eRRORs = [{ code: '999', description: e }]
        })

        return result

    }

    static async postResult<T>(url: string, obj: any): Promise<IKResult<T>> {

        let result = {} as IKResult<T>

        await axios.post(url, obj).then((r) => {

            result = r.data

        }).catch((e) => {
            result.succeeded = false
            result.eRRORs = [{ code: '999', description: e }]
        })

        return result
    }
    static async putResult<T>(url: string, obj: any): Promise<IKResult<T>> {

        let result = {} as IKResult<T>

        await axios.put(url, obj).then((r) => {

            result = r.data

        }).catch((e) => {
            result.succeeded = false
            result.eRRORs = [{ code: '999', description: e }]
        })

        return result
    }

}