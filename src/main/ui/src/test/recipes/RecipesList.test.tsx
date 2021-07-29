import { render } from "@testing-library/react";
import RecipesList from "../../recipes/RecipesList";
import { getRecipe } from "../App.test";

describe("RecipesList", () => {
  test("renders properly without recipes", async () => {
    const { findByText } = render(<RecipesList recipes={[]}/>)

    expect(await findByText("PRZEPISY")).toBeDefined()
  })

  test("renders properly fetched recipes", async () => {
    const { findByText } = render(<RecipesList recipes={[
      getRecipe("Recipe 1"),
      getRecipe("Recipe 2"),
      getRecipe("Recipe 3"),
    ]}/>)

    expect(await findByText("RECIPE 1")).toBeDefined()
    expect(await findByText("RECIPE 2")).toBeDefined()
    expect(await findByText("RECIPE 3")).toBeDefined()
  })
})
