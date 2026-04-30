import { fireEvent, render } from "@testing-library/react";
import IngredientsList from "../../ingredients/IngredientsList";
import { NetworkService } from "../../NetworkService";
import { InventoryItem } from "../../recipes/model";
import { getIngredient } from "../testUtils";

jest.mock("../../NetworkService")

const getIngredientsMock = NetworkService.getIngredients as jest.Mock

const makeInventory = (...names: string[]): Map<number, InventoryItem> => {
  const map = new Map<number, InventoryItem>()
  names.forEach(name => {
    const ingredient = getIngredient(name)
    map.set(ingredient.id, { ingredient, quantity: 1, unit: "PIECE" })
  })
  return map
}

describe("IngredientsList", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("displays search results from the service", async () => {
    getIngredientsMock.mockReturnValue([
      getIngredient("Ingredient 1"),
      getIngredient("Ingredient 2"),
    ])
    const { findByText, findByTestId } = render(
      <IngredientsList
        inventory={new Map()}
        onAddToInventory={jest.fn()}
        onRemoveFromInventory={jest.fn()}
        onUpdateInventoryItem={jest.fn()}
      />
    )
    const input = await findByTestId("Search-input")

    fireEvent.change(input, { target: { value: "query" } })

    expect(await findByText("Ingredient 1")).toBeDefined()
    expect(await findByText("Ingredient 2")).toBeDefined()
  })

  test("calls onAddToInventory when a search result is clicked", async () => {
    const ingredient1 = getIngredient("Ingredient 1");
    getIngredientsMock.mockReturnValue([ingredient1, getIngredient("Ingredient 2")])
    const onAddToInventory = jest.fn();
    const { findByTestId, findByText } = render(
      <IngredientsList
        inventory={new Map()}
        onAddToInventory={onAddToInventory}
        onRemoveFromInventory={jest.fn()}
        onUpdateInventoryItem={jest.fn()}
      />
    )

    const input = await findByTestId("Search-input")
    fireEvent.change(input, { target: { value: "query" } })
    fireEvent.click(await findByText("Ingredient 1"))

    expect(onAddToInventory).toHaveBeenCalledWith(ingredient1)
  })

  test("displays inventory items", async () => {
    const { findByTestId } = render(
      <IngredientsList
        inventory={makeInventory("Apple", "Bread", "Tea")}
        onAddToInventory={jest.fn()}
        onRemoveFromInventory={jest.fn()}
        onUpdateInventoryItem={jest.fn()}
      />
    )

    expect(await findByTestId("IngredientsList-ingredients--ingredient-Apple")).toBeDefined()
    expect(await findByTestId("IngredientsList-ingredients--ingredient-Bread")).toBeDefined()
    expect(await findByTestId("IngredientsList-ingredients--ingredient-Tea")).toBeDefined()
  })

  test("calls onRemoveFromInventory when an ingredient is removed", async () => {
    const onRemoveFromInventory = jest.fn();
    const apple = getIngredient("Apple")
    const inventory = new Map<number, InventoryItem>()
    inventory.set(apple.id, { ingredient: apple, quantity: 2, unit: "PIECE" })

    const { findByTestId } = render(
      <IngredientsList
        inventory={inventory}
        onAddToInventory={jest.fn()}
        onRemoveFromInventory={onRemoveFromInventory}
        onUpdateInventoryItem={jest.fn()}
      />
    )

    const removeButton = await findByTestId("IngredientsList-ingredients--removeIngredient-Apple")
    fireEvent.click(removeButton)

    expect(onRemoveFromInventory).toHaveBeenCalledWith(apple)
  })
})
