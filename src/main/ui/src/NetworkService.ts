import axios from "axios";
import { Ingredient, QuantityUnit, Recipe } from "./recipes/model";

export type SortType = "ingredients" | "category";

export type Sort = IngredientsSort | CategorySort;

type IngredientsSort = {
  type: "ingredients",
  ingredients: string,
}

type CategorySort = {
  type: "category",
  ingredients: string,
  category?: string,
}

export interface NetworkServiceProvider {
  getRecipes: (sort: Sort) => Promise<Recipe[]>
  getIngredients: (query: string, limit: number) => Promise<Ingredient[]>
  addRecipe: (recipe: AddRecipeRequest) => Promise<void>
  addTag: (tagName: string) => Promise<void>
  deleteRecipe: (recipe: Recipe) => Promise<void>
  updateRecipe: (
    id: number, name: string, ingredients: Array<{ id: number, quantity: number, unit: QuantityUnit }>
  ) => Promise<Recipe>
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
  getRecipes: async (sort: Sort): Promise<Recipe[]> => {
    if (sort.type === "ingredients") {
      const url = `/recipes?ingredientsSort=${sort.ingredients}`;
      return (await axiosInstance.get(url)).data;
    } else {
      const url = sort.category === undefined ?
        `/recipes?ingredientsSort=${sort.ingredients}` :
        `/recipes?ingredientsSort=${sort.ingredients}&categorySort=${sort.category}`;
      return (await axiosInstance.get(url)).data;
    }
  },
  getIngredients: async (query: string, limit: number): Promise<Ingredient[]> =>
    (await axiosInstance.get(`/ingredients?search=${query}&limit=${limit}`)).data,
  addRecipe: async (recipe: AddRecipeRequest): Promise<void> => axiosInstance.post("/recipes", recipe),
  addTag: async (tag: string): Promise<void> => axiosInstance.post('/tags', { name: tag }),
  deleteRecipe: async ({ id }: Recipe): Promise<void> => axiosInstance.delete(`/recipes/${id}`),
  updateRecipe: async (
    id: number, name: string, ingredients: Array<{ id: number, quantity: number, unit: QuantityUnit }>
  ): Promise<Recipe> =>
    (await axiosInstance.patch(`/recipes/${id}/ingredients`, { name, ingredients })).data,
}

