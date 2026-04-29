import { render } from "@testing-library/react";
import { Recipe } from "../../recipes/model";
import RecipesListItem from "../../recipes/RecipesListItem";

describe("RecipesListItem", () => {
  test("renders properly", async () => {
    const recipe: Recipe = {
      id: 1,
      name: "Recipe",
      source: "Source",
      timeInMinutes: 10,
      categoryServings: {},
      balanceSum: 0,
      inflammationSum: 0,
      tags: [],
      quantifiedIngredients: [
        { ingredient: { name: "Ingredient 1", id: 1, vataBalance: "BALANCING" }, unit: "LITER", quantity: 1 },
        { ingredient: { name: "Ingredient 2", id: 2, vataBalance: "BALANCING" }, unit: "TEA_SPOON", quantity: 3 },
        { ingredient: { name: "Ingredient 3", id: 3, vataBalance: "BALANCING" }, unit: "CUP", quantity: 0.5 },
      ]
    };
    const { findByText } = render(
      <RecipesListItem
        recipe={recipe}
        ingredients={new Set<string>()}
        allTags={[]}
        selected={false}
        hasUnitMismatch={false}
        onRemoveRecipeClick={jest.fn()}
        onSelectClick={jest.fn()}
        onRecipeEdited={jest.fn()}
      />
    )

    expect(await findByText("RECIPE")).toBeDefined()
    expect(await findByText("Source")).toBeDefined()
    expect(await findByText("Ingredient 1 1 l, Ingredient 2 3 łyżeczki, Ingredient 3 0.5 szklanki (0/3)")).toBeDefined()
  })
})
