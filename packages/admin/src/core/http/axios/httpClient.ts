import { Subject } from "rxjs";
import axios, { AxiosRequestConfig } from "axios";

import { httpMockAdapter } from "./httpMockAdapter";

class HttpClient {
  private cancelSubject = new Subject<void>();
  
  constructor() {
    axios.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("Response Interceptor: Error in response", error);
        return Promise.reject(error);
      }
    );

    if (import.meta.env.DEV) {
      httpMockAdapter(axios);
    }
  }

  // createRequest
  private createRequest<T, D>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const source = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      ...config,
      timeout: 10000,
      timeoutErrorMessage: "Request timed out",
      cancelToken: source.token,
    };
    return axios[method]<T>(url, data, requestConfig).then((response) => {
      return response.data;
    });
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.createRequest("get", url, undefined, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.createRequest("post", url, data, config);
  }
  put<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.createRequest("put", url, data, config);
  }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.createRequest("delete", url, undefined, config);
  }
  cancelAllRequests() {
    this.cancelSubject.next();
  }
}
export const httpClient = new HttpClient();
