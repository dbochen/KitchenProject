import { fireEvent, render } from "@testing-library/react";
import IngredientsList from "../../ingredients/IngredientsList";
import { NetworkService } from "../../NetworkService";
import { getIngredient } from "../testUtils";

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
      <IngredientsList
        onUpdateRecipesClick={jest.fn()}
        ingredients={new Set()}
        onAddIngredientClick={jest.fn()}
        onRemoveIngredientClick={jest.fn()}
      />
    )
    const input = await findByTestId("IngredientsList-input")

    fireEvent.change(input, { target: { value: "query" } })

    expect(await findByText("Ingredient 1")).toBeDefined()
    expect(await findByText("Ingredient 2")).toBeDefined()
  })

  test("calls onAddIngredientClick callback when the ingredient on the search list is clicked", async () => {
    const ingredient1 = getIngredient("Ingredient 1");
    getIngredientsMock.mockReturnValue([
      ingredient1,
      getIngredient("Ingredient 2"),
    ])
    const onAddIngredientClick = jest.fn();
    const { findByTestId } = render(
      <IngredientsList
        onUpdateRecipesClick={jest.fn()}
        ingredients={new Set()}
        onAddIngredientClick={onAddIngredientClick}
        onRemoveIngredientClick={jest.fn()}
      />
    )

    const input = await findByTestId("IngredientsList-input")
    fireEvent.change(input, { target: { value: "query" } })
    const ingredient = await findByTestId('IngredientsList-searchResults--ingredient-Ingredient 1')
    fireEvent.click(ingredient)

    expect(onAddIngredientClick).toHaveBeenCalledWith(ingredient1)
  })

  test("displays the list of added ingredients", async () => {
    const { findByTestId } = render(
      <IngredientsList
        onUpdateRecipesClick={jest.fn()}
        ingredients={new Set([getIngredient('Apple'), getIngredient('Bread'), getIngredient('Tea')])}
        onAddIngredientClick={jest.fn()}
        onRemoveIngredientClick={jest.fn()}
      />
    )

    expect(await findByTestId('IngredientsList-ingredients--ingredient-Apple')).toBeDefined()
    expect(await findByTestId('IngredientsList-ingredients--ingredient-Bread')).toBeDefined()
    expect(await findByTestId('IngredientsList-ingredients--ingredient-Tea')).toBeDefined()
  })

  test("calls onRemoveIngredientClick callback when ingredient is removed", async () => {
    const onRemoveIngredientClick = jest.fn();
    const ingredient = getIngredient('Apple');
    const { findByTestId } = render(
      <IngredientsList
        onUpdateRecipesClick={jest.fn()}
        ingredients={new Set([ingredient, getIngredient('Bread'), getIngredient('Tea')])}
        onAddIngredientClick={jest.fn()}
        onRemoveIngredientClick={onRemoveIngredientClick}
      />
    )

    const removeButton = await findByTestId('IngredientsList-ingredients--removeIngredient-Apple')
    fireEvent.click(removeButton)

    expect(onRemoveIngredientClick).toHaveBeenCalledWith(ingredient)
  })

  test("calls onUpdateRecipesClick callback when recipes update button is clicked", async () => {
    const onUpdateRecipesClick = jest.fn();
    const ingredients = new Set([getIngredient('Apple'), getIngredient('Bread'), getIngredient('Tea')]);
    const { findByTestId } = render(
      <IngredientsList
        onUpdateRecipesClick={onUpdateRecipesClick}
        ingredients={ingredients}
        onAddIngredientClick={jest.fn()}
        onRemoveIngredientClick={jest.fn()}
      />
    )

    const updateButton = await findByTestId('IngredientsList-ingredients--updateRecipes')
    fireEvent.click(updateButton)

    expect(onUpdateRecipesClick).toHaveBeenCalledWith(ingredients)
  })
})
