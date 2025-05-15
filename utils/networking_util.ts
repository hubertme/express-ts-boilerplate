import axios, {AxiosRequestConfig, Method as AxiosMethod} from "axios";

/**
 * Represents a generic response from an HTTP request, simplifying Axios response consumption.
 */
export class Response {
    /** The data payload of the response. */
    data: any;
    /** The headers of the response. */
    headers: any;

    /**
     * Constructs a Response object.
     * @param headers The HTTP response headers.
     * @param data The data payload from the HTTP response.
     */
    constructor(headers: object, data: object) {
        this.data = data;
        this.headers = headers;
    }
}

/**
 * Utility class for making HTTP requests using Axios.
 */
export default class NetworkingUtil {
    /**
     * Performs a generic HTTP request.
     * @param url The URL for the request.
     * @param method The HTTP method (GET, POST, PUT, DELETE, OPTIONS, PATCH).
     * @param params Optional query parameters for the request.
     * @param data Optional data payload for the request body.
     * @param headers Optional custom headers for the request.
     * @returns A Promise resolving to a Response object.
     * @throws Error if the request fails due to network issues or server errors not returning a typical Axios response structure.
     * @throws Response object if the server responds with an error status code (e.g., 4xx, 5xx), containing server's response headers and data.
     * @private
     */
    private static async request(url: string, method: AxiosMethod, params: {[key: string]: any} = {}, data: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
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
            if (headers != null) {
                config.headers = headers;
            }

            // console.log('Request Config:', config);
            const resp = await axios(config);
            const resData = resp.data;
            const resHeaders = resp.headers;

            return new Response(resHeaders, resData);
        } catch (e: any) {
            // console.log('Error in NetworkingUtil.request:', e);
            if (e.response) {
                // Axios error with a response from the server
                const resp = e.response;
                const resData = resp.data;
                const resHeaders = resp.headers;
                // It might be better to throw a custom error that includes status code
                // For now, re-throwing a Response object, assuming this is expected by consumers.
                // Consider changing this to throw an error that includes resp.status for better handling.
                throw new Response(resHeaders, resData); 
            } else if (e.request) {
                // Axios error where the request was made but no response was received
                // (e.g., network error, timeout)
                console.error('NetworkingUtil Error: No response received for request', e.request);
                throw new Error('Network Error: No response received from server.');
            } else {
                // Something else happened in setting up the request that triggered an Error
                console.error('NetworkingUtil Error: Error setting up request', e.message);
                throw e; // Re-throw the original error
            }
        }
    }

    /**
     * Performs an HTTP GET request.
     * @param url The URL for the request.
     * @param params Optional query parameters.
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async get(url: string, params: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "GET", params, {}, headers);
        return resp;
    }

    /**
     * Performs an HTTP POST request.
     * @param url The URL for the request.
     * @param data Optional data payload for the request body.
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async post(url: string, data: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "POST", {}, data, headers);
        return resp;
    }

    /**
     * Performs an HTTP PUT request.
     * @param url The URL for the request.
     * @param data Optional data payload for the request body.
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async put(url: string, data: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "PUT", {}, data, headers);
        return resp;
    }

    /**
     * Performs an HTTP DELETE request.
     * @param url The URL for the request.
     * @param params Optional query parameters.
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async delete(url: string, params: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "DELETE", params, {}, headers);
        return resp;
    }

    /**
     * Performs an HTTP OPTIONS request.
     * @param url The URL for the request.
     * @param data Optional data payload (though typically not used for OPTIONS).
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async options(url: string, data: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "OPTIONS", {}, data, headers);
        return resp;
    }

    /**
     * Performs an HTTP PATCH request.
     * @param url The URL for the request.
     * @param data Optional data payload for the request body.
     * @param headers Optional custom headers.
     * @returns A Promise resolving to a Response object.
     */
    static async patch(url: string, data: {[key: string]: any} = {}, headers: {[key: string]: any} = {}): Promise<Response> {
        const resp = await NetworkingUtil.request(url, "PATCH", {}, data, headers);
        return resp;
    }
}
