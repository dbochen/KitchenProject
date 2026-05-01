export type RecipeScores = {
  ingredients: number;
  balance: number;
  inflammation: number;
  servings: number;
  standard: number;
}

export type Recipe = {
  name: string,
  quantifiedIngredients: QuantifiedIngredient[],
  source: string,
  timeInMinutes: number
  id: number,
  categoryServings: Record<string, number>,
  balanceSum: number,
  inflammationSum: number,
  tags: string[],
}

export type Tag = {
  id: number,
  name: string,
}

export type QuantifiedIngredient = {
  ingredient: Ingredient,
  quantity: number,
  unit: QuantityUnit,
  substitutes: Ingredient[],
}

export type Ingredient = {
  name: string,
  id: number,
  vataBalance: "VERY_BALANCING" | "BALANCING" | "AGGRAVATING" | "VERY_AGGRAVATING",
  storageLocation?: string,
}

export const QUANTITY_UNITS =
  ["PIECE", "GRAM", "TEA_SPOON", "TABLE_SPOON", "CUP", "LITER", "MILLILITER", "HANDFUL"] as const

export type QuantityUnit = typeof QUANTITY_UNITS[number]

export type InventoryItem = {
  ingredient: Ingredient
  quantity: number
  unit: QuantityUnit
  perishable?: boolean
}

export const categoryToDailyServings: Record<string, number> = {
  "NUTS_AND_SEEDS": 1,
  "OTHER_VEGETABLES": 2,
  "GREENS": 2,
  "BEANS": 3,
  "OTHER_FRUITS": 3,
  "WHOLE_GRAINS": 3,
  "BERRIES": 1,
  "CRUCIFEROUS_VEGETABLES": 1,
  "FLAXSEED": 1,
}
