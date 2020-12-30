import axios, {AxiosRequestConfig} from "axios";

/**
 * Response object to ease the consumption of Axios response
 */
export class Response {
    data: any;
    headers: any;

    constructor(headers: object, data: object) {
        this.data = data;
        this.headers = headers;
    }
}

export default class NetworkingUtil {
    /**
     * Basic API request for all networking available methods
     * @param url
     * @param method
     * @param params - Query params for GET / DELETE request
     * @param data - Basic request body
     * @private
     * @return A Response object declared on this file
     */
    private static async request(url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", params: {[key: string]: any} = null, data: {[key: string]: any} = null): Promise<Response> {
        let resp: any;

        try {
            const config: AxiosRequestConfig = {
                method,
                url,
                responseType: 'json',
                timeout: 30000,
                // params
                // data
            }
            if (params != null) {
                config.params = params;
            }
            if (data != null) {
                config.data = data;
            }

            resp = await axios(config);
        } catch (e) {
            // console.log('Error in NetworkingUtil.request:', e);
            resp = e.response;
        }

        const resData = resp.data;
        const resHeaders = resp.headers;

        return new Response(resHeaders, resData);
    }

    static async get(url: string, params: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "GET", params, null);
            return resp;
        } catch (e) {
            return null;
        }
    }

    static async post(url: string, data: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "POST", null, data);
            return resp;
        } catch (e) {
            return null;
        }
    }

    static async put(url: string, data: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "PUT", null, data);
            return resp;
        } catch (e) {
            return null;
        }
    }

    static async delete(url: string, params: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "DELETE", params, null);
            return resp;
        } catch (e) {
            return null;
        }
    }

    static async options(url: string, data: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "OPTIONS", null, data);
            return resp;
        } catch (e) {
            return null;
        }
    }

    static async patch(url: string, data: {[key: string]: any} = null): Promise<Response> {
        try {
            const resp = await NetworkingUtil.request(url, "PATCH", null, data);
            return resp;
        } catch (e) {
            return null;
        }
    }
}
