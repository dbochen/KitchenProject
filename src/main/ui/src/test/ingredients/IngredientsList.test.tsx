import { fireEvent, render } from "@testing-library/react";
import IngredientsList from "../../ingredients/IngredientsList";
import { Ingredient } from "../../recipes/model";
import { NetworkServiceProvider } from "../../networkService";

describe("IngredientsList", () => {
  test("displays the list of ingredients returned by the service", async () => {
    const networkService = mockNetworkService([
      { name: "Ingredient 1", id: 1 },
      { name: "Ingredient 2", id: 2 },
    ])
    const { findByText, findByTestId } = render(<IngredientsList networkService={networkService}/>)
    const input = await findByTestId("IngredientsList-input")

    fireEvent.change(input, { target: { value: "query" } })

    expect(await findByText("Ingredient 1")).toBeDefined()
    expect(await findByText("Ingredient 2")).toBeDefined()
  })
})

const mockNetworkService = (ingredients: Ingredient[]): NetworkServiceProvider => ({
    getRecipes: jest.fn(),
    getIngredients: jest.fn().mockImplementation(() => ingredients),
  }
)
