import axios from "axios";
import { Ingredient, Recipe } from "./recipes/model";

export interface NetworkServiceProvider {
  getRecipes: (sort: string) => Promise<Recipe[]>
  getIngredients: (query: string, limit: number) => Promise<Ingredient[]>
}

const axiosInstance = axios.create({ baseURL: "http://localhost:8080" })

export const NetworkService: NetworkServiceProvider = {
  getRecipes: async (sort: string): Promise<Recipe[]> =>
    (await axiosInstance.get(`/recipes?sort=${sort}`)).data,
  getIngredients: async (query: string, limit: number): Promise<Ingredient[]> =>
    (await axiosInstance.get(`/ingredients?search=${query}&limit=${limit}`)).data
}

