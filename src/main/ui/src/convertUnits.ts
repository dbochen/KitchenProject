import { QuantityUnit } from "./recipes/model"

// All volume units expressed in ml — enables automatic cross-conversion within the family
const TO_ML: Partial<Record<QuantityUnit, number>> = {
  MILLILITER:  1,
  LITER:       1000,
  TEA_SPOON:   5,
  TABLE_SPOON: 15,
  CUP:         240,
}

export const convertToUnit = (quantity: number, from: QuantityUnit, to: QuantityUnit): number | null => {
  if (from === to) return quantity
  const fromMl = TO_ML[from]
  const toMl = TO_ML[to]
  if (fromMl !== undefined && toMl !== undefined) return quantity * fromMl / toMl
  return null
}

export const areCompatibleUnits = (a: QuantityUnit, b: QuantityUnit): boolean =>
  a === b || convertToUnit(1, a, b) !== null
