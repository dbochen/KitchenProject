import { Ingredient, InventoryItem, QuantityUnit, Recipe } from "../recipes/model";

export const getRecipe = (name: string, ingredientsNames: string[] = []): Recipe => ({
  name,
  quantifiedIngredients: ingredientsNames.map(ingredientName => ({
    ingredient: getIngredient(ingredientName),
    quantity: 1,
    unit: "PIECE",
    substitutes: [],
  })),
  source: "source",
  timeInMinutes: 1,
  id: Math.floor(Math.random() * 1000),
  categoryServings: {},
  balanceSum: 0,
  inflammationSum: 0,
  tags: [],
})

export const getIngredient = (name: string, id?: number): Ingredient => ({
  name,
  id: id ?? Math.floor(Math.random() * 1000),
  vataBalance: "BALANCING",
})

export const getInventoryItem = (
  ingredient: Ingredient,
  quantity: number,
  unit: QuantityUnit = "PIECE"
): InventoryItem => ({ ingredient, quantity, unit })

export const makeInventory = (items: InventoryItem[]): Map<number, InventoryItem> =>
  new Map(items.map(item => [item.ingredient.id, item]))
