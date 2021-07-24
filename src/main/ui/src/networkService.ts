import axios, { AxiosInstance } from "axios";
import { Recipe } from "./recipes/model";

export interface NetworkServiceProvider {
  getRecipes: () => Promise<Recipe[]>
  getIngredients: (query: string, limit: number) => Promise<string[]>
}

export class NetworkService implements NetworkServiceProvider {

  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({ baseURL: "http://localhost:8080" });
  }

  public async getRecipes(): Promise<Recipe[]> {
    return (await this.axiosInstance.get("/recipes")).data
  }

  public async getIngredients(query: string, limit: number): Promise<string[]> {
    return (await this.axiosInstance.get(`/ingredients?search=${query}&limit=${limit}`)).data
  }

}
