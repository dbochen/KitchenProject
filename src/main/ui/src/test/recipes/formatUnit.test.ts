import { QuantityUnit } from "../../recipes/model";
import { formatUnit } from "../../recipes/formatUnit";

describe("formatUnit", () => {

  test.each<{ unit: QuantityUnit, expected: string }>([
      { unit: "GRAM", expected: "g" },
      { unit: "LITER", expected: "l" },
      { unit: "MILLILITER", expected: "ml" },
    ]
  )("formats simple units properly", ({ unit, expected }) => {
    const formatted = formatUnit(1, unit)
    expect(formatted).toEqual(expected)
  })

  test.each<{ unit: QuantityUnit, quantity: number, expected: string }>([
      { unit: "TEA_SPOON", quantity: 1, expected: "łyżeczka" },
      { unit: "TEA_SPOON", quantity: 2, expected: "łyżeczki" },
      { unit: "TEA_SPOON", quantity: 100, expected: "łyżeczek" },
      { unit: "TABLE_SPOON", quantity: 1, expected: "łyżka" },
      { unit: "TABLE_SPOON", quantity: 3, expected: "łyżki" },
      { unit: "TABLE_SPOON", quantity: 45, expected: "łyżek" },
      { unit: "CUP", quantity: 1, expected: "szklanka" },
      { unit: "CUP", quantity: 4, expected: "szklanki" },
      { unit: "CUP", quantity: 1000, expected: "szklanek" },
    ]
  )("formats complex units properly", ({ unit, quantity, expected }) => {
    const formatted = formatUnit(quantity, unit)
    expect(formatted).toEqual(expected)
  })
})
