export type Recipe = {
  name: string,
  ingredients: Ingredient[],
  source: string,
  timeInMinutes: number
}

export type Ingredient = {
  name: string,
  quantity: number,
  unit: QuantityUnit
}

export type QuantityUnit = "GRAM"
  | "TEA_SPOON"
  | "TABLE_SPOON"
  | "CUP"
  | "LITER"
  | "MILLILITER"
