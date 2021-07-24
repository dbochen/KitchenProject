export type Recipe = {
  name: string,
  quantifiedIngredients: QuantifiedIngredient[],
  source: string,
  timeInMinutes: number
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

export type QuantityUnit = "GRAM"
  | "TEA_SPOON"
  | "TABLE_SPOON"
  | "CUP"
  | "LITER"
  | "MILLILITER"
