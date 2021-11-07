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
      quantifiedIngredients: [
        {
          ingredient: {
            name: "Ingredient 1",
            id: 1,
          },
          unit: "LITER",
          quantity: 1
        },
        {
          ingredient: {
            name: "Ingredient 2",
            id: 2,
          },
          unit: "TEA_SPOON",
          quantity: 3
        },
        {
          ingredient: {
            name: "Ingredient 3",
            id: 3,
          },
          unit: "CUP",
          quantity: 0.5
        }
      ]
    };
    const { findByText } = render(<RecipesListItem recipe={recipe} ingredients={new Set()}/>)

    expect(await findByText("RECIPE")).toBeDefined()
    expect(await findByText("Source")).toBeDefined()
    expect(await findByText("Ingredient 1 1 l, Ingredient 2 3 łyżeczki, Ingredient 3 0.5 szklanki")).toBeDefined()
  })
})
