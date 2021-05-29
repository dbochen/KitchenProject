import { render } from "@testing-library/react";
import RecipesList from "../../recipes/RecipesList";
import { Recipe } from "../../recipes/model";
import { NetworkServiceProvider } from "../../networkService";

describe("RecipesList", () => {
  test("renders properly without recipes", async () => {
    const networkService = mockNetworkService([])

    const { findByText } = render(<RecipesList networkService={networkService}/>)

    expect(await findByText("PRZEPISY")).toBeDefined()
  })

  test("renders properly fetched recipes", async () => {
    const networkService = mockNetworkService([
      getRecipe("Recipe 1"),
      getRecipe("Recipe 2"),
      getRecipe("Recipe 3"),
    ])

    const { findByText } = render(<RecipesList networkService={networkService}/>)

    expect(await findByText("RECIPE 1")).toBeDefined()
    expect(await findByText("RECIPE 2")).toBeDefined()
    expect(await findByText("RECIPE 3")).toBeDefined()
  })
})

const mockNetworkService = (recipes: Recipe[]): NetworkServiceProvider => ({
    getRecipes: jest.fn().mockImplementation(() => ({
      data: recipes
    }))
  }
)

const getRecipe = (name: string): Recipe => ({
  name,
  ingredients: [],
  source: "source",
  timeInMinutes: 1,
})
