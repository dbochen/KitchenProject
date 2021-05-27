import axios, { AxiosInstance, AxiosResponse } from "axios";

export class NetworkService {

  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({ baseURL: "http://localhost:8080" });
  }

  public getHello(): Promise<AxiosResponse> {
    return this.axiosInstance.get("/hello")
  }

}
