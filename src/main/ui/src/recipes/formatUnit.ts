import { QuantityUnit } from "./model";

export const formatUnit = (quantity: number, unit: QuantityUnit): string => {

  const getProperQuantityForm = (firstForm: string, secondForm: string, thirdForm: string): string => {
    if (quantity === 1) {
      return firstForm
    }
    return quantity < 5 ? secondForm : thirdForm
  }

  switch (unit) {
    case "GRAM":
      return "g"
    case "TEA_SPOON": {
      return getProperQuantityForm("łyżeczka", "łyżeczki", "łyżeczek")
    }
    case "TABLE_SPOON": {
      return getProperQuantityForm("łyżka", "łyżki", "łyżek")
    }
    case "CUP": {
      return getProperQuantityForm("szklanka", "szklanki", "szklanek")
    }
    case "LITER": {
      return "l"
    }
    case "MILLILITER": {
      return "ml"
    }
    case "PIECE": {
      return getProperQuantityForm("sztuka", "sztuki", "sztuk")
    }
    case "HANDFUL": {
      return getProperQuantityForm("garść", "garście", "garści")
    }
  }
}


