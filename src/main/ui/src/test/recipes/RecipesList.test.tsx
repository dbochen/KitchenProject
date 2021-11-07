import { render } from "@testing-library/react";
import RecipesList from "../../recipes/RecipesList";
import { getIngredient, getRecipe } from "../testUtils";

describe("RecipesList", () => {
  test("renders properly without recipes", async () => {
    const { findByText } = render(<RecipesList recipes={[]} onAddIngredientClick={jest.fn()} ingredients={new Set()}/>)

    expect(await findByText("PRZEPISY")).toBeDefined()
  })

  test("renders properly fetched recipes", async () => {
    const recipes = [
      getRecipe("Recipe 1"),
      getRecipe("Recipe 2"),
      getRecipe("Recipe 3"),
    ];
    const { findByText } = render(
      <RecipesList
        recipes={recipes}
        onAddIngredientClick={jest.fn()}
        ingredients={new Set()}
      />
    )

    expect(await findByText("RECIPE 1")).toBeDefined()
    expect(await findByText("RECIPE 2")).toBeDefined()
    expect(await findByText("RECIPE 3")).toBeDefined()
  })

  test("removes the chosen ingredients from the propositions list", async () => {
    const recipes = [getRecipe("Recipe 1", ["Ingredient 1", "Ingredient 2", "Ingredient 3"])]

    const { findByTestId, queryByTestId, rerender } = render(
      <RecipesList recipes={recipes} ingredients={new Set()} onAddIngredientClick={jest.fn()}/>
    )

    expect(await findByTestId("RecipesList-propositions--Ingredient 1")).toBeDefined()
    expect(await findByTestId("RecipesList-propositions--Ingredient 2")).toBeDefined()
    expect(await findByTestId("RecipesList-propositions--Ingredient 3")).toBeDefined()

    rerender(
      <RecipesList
        recipes={recipes}
        ingredients={new Set([getIngredient("Ingredient 1")])}
        onAddIngredientClick={jest.fn()}
      />
    )

    expect(await queryByTestId("RecipesList-propositions--Ingredient 1")).toBeNull()
    expect(await queryByTestId("RecipesList-propositions--Ingredient 2")).toBeDefined()
    expect(await queryByTestId("RecipesList-propositions--Ingredient 3")).toBeDefined()
  })
})
