import { Ingredient, Recipe } from "../recipes/model";

export const getRecipe = (name: string, ingredientsNames: string[] = []): Recipe => ({
  name,
  quantifiedIngredients: ingredientsNames.map(ingredientName => ({
    ingredient: getIngredient(ingredientName),
    quantity: 1,
    unit: "PIECE"
  })),
  source: "source",
  timeInMinutes: 1,
  id: Math.floor(Math.random() * 1000)
})

export const getIngredient = (name: string): Ingredient => ({
  name,
  id: Math.floor(Math.random() * 1000)
})
