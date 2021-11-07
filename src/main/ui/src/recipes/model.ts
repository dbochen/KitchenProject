export type Recipe = {
  name: string,
  quantifiedIngredients: QuantifiedIngredient[],
  source: string,
  timeInMinutes: number
  id: number
}

export type QuantifiedIngredient = {
  ingredient: Ingredient,
  quantity: number,
  unit: QuantityUnit
}

export type Ingredient = {
  name: string,
  id: number,
}

export const QUANTITY_UNITS =
  ["PIECE", "GRAM", "TEA_SPOON", "TABLE_SPOON", "CUP", "LITER", "MILLILITER", "HANDFUL"] as const

export type QuantityUnit = typeof QUANTITY_UNITS[number]
