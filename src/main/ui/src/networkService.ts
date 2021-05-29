import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface NetworkServiceProvider {
  getRecipes: () => Promise<AxiosResponse>
}

export class NetworkService implements NetworkServiceProvider {

  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({ baseURL: "http://localhost:8080" });
  }

  public getRecipes(): Promise<AxiosResponse> {
    return this.axiosInstance.get("/recipes")
  }

}