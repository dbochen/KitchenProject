import { fireEvent, render } from "@testing-library/react";
import IngredientsList from "../../ingredients/IngredientsList";
import { NetworkService } from "../../NetworkService";
import { getIngredient } from "../App.test";

jest.mock("../../NetworkService")

const getIngredientsMock = NetworkService.getIngredients as jest.Mock

describe("IngredientsList", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("displays the list of ingredients returned by the service", async () => {
    getIngredientsMock.mockReturnValue([
      getIngredient("Ingredient 1"),
      getIngredient("Ingredient 2"),
    ])
    const { findByText, findByTestId } = render(
      <IngredientsList onUpdateRecipesClick={jest.fn()}/>
    )
    const input = await findByTestId("IngredientsList-input")

    fireEvent.change(input, { target: { value: "query" } })

    expect(await findByText("Ingredient 1")).toBeDefined()
    expect(await findByText("Ingredient 2")).toBeDefined()
  })
})
