import { computeProjectedInventory } from "../App";
import { getIngredient, getInventoryItem, makeInventory } from "./testUtils";
import { QuantifiedIngredient } from "../recipes/model";

const makeRecipe = (qis: QuantifiedIngredient[]) => ({
  id: 1,
  name: "Test",
  source: "",
  timeInMinutes: 0,
  quantifiedIngredients: qis,
  categoryServings: {},
  balanceSum: 0,
  inflammationSum: 0,
  tags: [],
})

const tomato = getIngredient("Pomidor", 1)
const cherry = getIngredient("Pomidorki koktajlowe", 2)
const maple = getIngredient("Syrop klonowy", 3)
const honey = getIngredient("Miód", 4)

describe("computeProjectedInventory", () => {
  it("deducts from original when it has stock", () => {
    const inventory = makeInventory([getInventoryItem(tomato, 2)])
    const recipe = makeRecipe([{ ingredient: tomato, quantity: 1, unit: "PIECE", substitutes: [] }])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(1)
  })

  it("shows deficit on original when stock is insufficient", () => {
    const inventory = makeInventory([getInventoryItem(tomato, 0.5)])
    const recipe = makeRecipe([{ ingredient: tomato, quantity: 1, unit: "PIECE", substitutes: [] }])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(-0.5)
  })

  it("uses substitute when original has no stock", () => {
    const inventory = makeInventory([
      getInventoryItem(tomato, 0),
      getInventoryItem(cherry, 30),
    ])
    const recipe = makeRecipe([
      { ingredient: tomato, quantity: 0.5, unit: "PIECE", substitutes: [cherry] },
    ])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(0)
    expect(result.get(cherry.id)).toBe(29.5)
  })

  it("prefers original over substitute when original has stock", () => {
    const inventory = makeInventory([
      getInventoryItem(tomato, 2),
      getInventoryItem(cherry, 30),
    ])
    const recipe = makeRecipe([
      { ingredient: tomato, quantity: 1, unit: "PIECE", substitutes: [cherry] },
    ])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(1)
    expect(result.get(cherry.id)).toBe(30)
  })

  it("shows deficit on original when neither original nor substitute has stock", () => {
    const inventory = makeInventory([
      getInventoryItem(tomato, 0),
      getInventoryItem(cherry, 0),
    ])
    const recipe = makeRecipe([
      { ingredient: tomato, quantity: 0.5, unit: "PIECE", substitutes: [cherry] },
    ])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(-0.5)
    expect(result.get(cherry.id)).toBe(0)
  })

  it("shows deficit on original when substitute is not in inventory", () => {
    const inventory = makeInventory([getInventoryItem(tomato, 0)])
    const recipe = makeRecipe([
      { ingredient: tomato, quantity: 0.5, unit: "PIECE", substitutes: [cherry] },
    ])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBe(-0.5)
    expect(result.get(cherry.id)).toBeUndefined()
  })

  it("converts units when deducting from substitute", () => {
    const inventory = makeInventory([
      getInventoryItem(maple, 0, "TEA_SPOON"),
      getInventoryItem(honey, 6, "TEA_SPOON"),
    ])
    const recipe = makeRecipe([
      { ingredient: maple, quantity: 1, unit: "TABLE_SPOON", substitutes: [honey] },
    ])
    const result = computeProjectedInventory(inventory, [recipe])
    // 1 TABLE_SPOON = 3 TEA_SPOON, honey had 6 → 3 remaining
    expect(result.get(maple.id)).toBe(0)
    expect(result.get(honey.id)).toBe(3)
  })

  it("does not deduct anything when ingredient is not tracked in inventory", () => {
    const inventory = makeInventory([])
    const recipe = makeRecipe([{ ingredient: tomato, quantity: 1, unit: "PIECE", substitutes: [] }])
    const result = computeProjectedInventory(inventory, [recipe])
    expect(result.get(tomato.id)).toBeUndefined()
  })
})
