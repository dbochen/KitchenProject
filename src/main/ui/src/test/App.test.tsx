import { render } from "@testing-library/react";
import App from "../App";
import { NetworkService } from "../NetworkService";
import { getIngredient, getRecipe } from "./testUtils";

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
