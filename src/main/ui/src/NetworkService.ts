import axios from "axios";
import { Ingredient, QuantityUnit, Recipe, Tag } from "./recipes/model";

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
  getTags: () => Promise<Tag[]>
  addRecipe: (recipe: AddRecipeRequest) => Promise<Recipe>
  addTag: (tagName: string) => Promise<void>
  deleteRecipe: (recipe: Recipe) => Promise<void>
  deleteIngredient: (id: number) => Promise<void>
  updateRecipe: (
    id: number, name: string,
    ingredients: Array<{ id: number, quantity: number, unit: QuantityUnit, substituteIds: number[] }>,
    tagIds: number[]
  ) => Promise<Recipe>
  markRecipeAsCooked: (id: number) => Promise<void>
}

interface AddRecipeRequest {
  name: string
  ingredients: Array<{
    id: number,
    quantity: number,
    unit: QuantityUnit,
    substituteIds: number[]
  }>,
  source?: string,
  tagIds?: number[]
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
  getTags: async (): Promise<Tag[]> =>
    (await axiosInstance.get('/tags')).data,
  addRecipe: async (recipe: AddRecipeRequest): Promise<Recipe> =>
    (await axiosInstance.post("/recipes", recipe)).data,
  addTag: async (tag: string): Promise<void> => axiosInstance.post('/tags', { name: tag }),
  deleteRecipe: async ({ id }: Recipe): Promise<void> => axiosInstance.delete(`/recipes/${id}`),
  deleteIngredient: async (id: number): Promise<void> => axiosInstance.delete(`/ingredients/${id}`),
  updateRecipe: async (
    id: number, name: string,
    ingredients: Array<{ id: number, quantity: number, unit: QuantityUnit, substituteIds: number[] }>,
    tagIds: number[]
  ): Promise<Recipe> =>
    (await axiosInstance.patch(`/recipes/${id}/ingredients`, { name, ingredients, tagIds })).data,
  markRecipeAsCooked: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/recipes/${id}/cook`)
  },
}
