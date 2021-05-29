import { render } from "@testing-library/react";
import { Recipe } from "../../recipes/model";
import RecipesListItem from "../../recipes/RecipesListItem";

describe("RecipesListItem", () => {
  test("renders properly", async () => {
    const recipe: Recipe = {
      name: "Recipe",
      source: "Source",
      timeInMinutes: 10,
      ingredients: [
        {
          name: "Ingredient 1",
          unit: "LITER",
          quantity: 1
        },
        {
          name: "Ingredient 2",
          unit: "TEA_SPOON",
          quantity: 3
        },
        {
          name: "Ingredient 3",
          unit: "CUP",
          quantity: 0.5
        }
      ]
    };
    const { findByText } = render(<RecipesListItem recipe={recipe}/>)

    expect(await findByText("RECIPE")).toBeDefined()
    expect(await findByText("Source")).toBeDefined()
    expect(await findByText("Ingredient 1 1 l, Ingredient 2 3 łyżeczki, Ingredient 3 0.5 szklanki")).toBeDefined()
  })
})
