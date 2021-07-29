import { render } from "@testing-library/react";
import App from "../App";
import { Ingredient, Recipe } from "../recipes/model";
import { NetworkService } from "../NetworkService";

jest.mock("../NetworkService")

const getRecipesMock = NetworkService.getRecipes as jest.Mock
const getIngredientsMock = NetworkService.getIngredients as jest.Mock

describe("App", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("fetches recipes on mount", async () => {
    getRecipesMock.mockReturnValue([
      getRecipe("Recipe 1"),
      getRecipe("Recipe 2"),
      getRecipe("Recipe 3"),
    ])
    getIngredientsMock.mockReturnValue([
      getIngredient("Ingredient 1"),
      getIngredient("Ingredient 2"),
      getIngredient("Ingredient 3"),
    ])
    const { findByText } = render(<App/>)

    expect(await findByText("PRZEPISY")).toBeDefined()

    expect(getRecipesMock).toHaveBeenCalledTimes(1)
    expect(getRecipesMock).toHaveBeenCalledWith("")

  })
})

export const getRecipe = (name: string): Recipe => ({
  name,
  quantifiedIngredients: [],
  source: "source",
  timeInMinutes: 1,
})

export const getIngredient = (name: string): Ingredient => ({
  name,
  id: Math.floor(Math.random() * 1000)
})
