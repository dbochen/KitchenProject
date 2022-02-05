import axios from "axios";
import { Ingredient, QuantityUnit, Recipe } from "./recipes/model";

export interface NetworkServiceProvider {
  getRecipes: (sort: string) => Promise<Recipe[]>
  getIngredients: (query: string, limit: number) => Promise<Ingredient[]>
  addRecipe: (recipe: AddRecipeRequest) => Promise<void>
  addTag: (tagName: string) => Promise<void>
  deleteRecipe: (recipe: Recipe) => Promise<void>
}

interface AddRecipeRequest {
  name: string
  ingredients: Array<{
    id: number,
    quantity: number,
    unit: QuantityUnit
  }>,
  source: string
}

const axiosInstance = axios.create({ baseURL: "http://localhost:8080" })

export const NetworkService: NetworkServiceProvider = {
  getRecipes: async (sort: string): Promise<Recipe[]> =>
    (await axiosInstance.get(`/recipes?sort=${sort}`)).data,
  getIngredients: async (query: string, limit: number): Promise<Ingredient[]> =>
    (await axiosInstance.get(`/ingredients?search=${query}&limit=${limit}`)).data,
  addRecipe: async (recipe: AddRecipeRequest): Promise<void> => axiosInstance.post("/recipes", recipe),
  addTag: async (tag: string): Promise<void> => axiosInstance.post('/tags', { name: tag }),
  deleteRecipe: async ({ id }: Recipe): Promise<void> => axiosInstance.delete(`/recipes/${id}`)
}

