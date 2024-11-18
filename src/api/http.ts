import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {useAccountStore} from "@/stores/accountStore.ts";
import {tryHideFullScreenLoading} from "@/components/Loading/fullScreen.ts";
import {checkStatus} from "@/api/helper/checkStatus.ts";
import {ResultData} from "@/models/resultJson.ts";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    loading?: boolean;
    cancel?: boolean;
}

const config = {
    baseURL: "https://educateserver.answer.ac.cn", // 基地址 https://educateserver.answer.ac.cn
    timeout: 0, // 超时时间
    withCredentials: true, // 允许携带cookie
}

class HttpRequest {
    service: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config)

        /**
         * 设置请求拦截器
         */
        this.service.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                const accountStore = useAccountStore();
                if (config.headers && typeof config.headers.set === "function") {
                    config.headers['token'] = accountStore.token;
                }
                return config;
            },
            (error: AxiosError) => {
                console.log("请求错误", error)
                return Promise.reject(error);
            })

        this.service.interceptors.response.use(
            (response: AxiosResponse & { config: CustomAxiosRequestConfig }) => {
                const {data, config} = response;
                config.loading && tryHideFullScreenLoading();
                return data;
            },
            async (error: AxiosError) => {
                console.log("响应错误", error)
                const {response} = error;
                tryHideFullScreenLoading();
                if (response) checkStatus(response.status);
                return Promise.reject(error);
            })
    }

    /**
     * @description 常用请求方法封装
     */
    get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.get(url, {params, ..._object});
    }

    post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
        return this.service.post(url, params, _object);
    }

    put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
        return this.service.put(url, params, _object);
    }

    delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
        return this.service.delete(url, {params, ..._object});
    }

    download(url: string, params?: object, _object = {}): Promise<BlobPart> {
        return this.service.post(url, params, {..._object, responseType: "blob"});
    }
}

export default new HttpRequest(config)