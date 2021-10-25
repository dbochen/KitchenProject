import { RecipesStrings } from "../strings";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { NetworkService } from "../NetworkService";
import { Ingredient, QuantifiedIngredient, QUANTITY_UNITS, QuantityUnit } from "./model";
import { formatUnit } from "./formatUnit";

const AddRecipe = (): JSX.Element => {

  const [recipeName, setRecipeName] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [ingredientQuery, setIngredientQuery] = useState<string>("");
  const [foundIngredients, setFoundIngredients] = useState<Ingredient[]>([]);
  const [chosenIngredients, setChosenIngredients] = useState<Record<number, QuantifiedIngredient>>({});

  const fetchIngredients = async (query: string): Promise<void> => {
    const response = await NetworkService.getIngredients(query, 5);
    setFoundIngredients(response)
  }

  useEffect(() => {
    fetchIngredients(ingredientQuery);
  }, [ingredientQuery]);

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void =>
    onInputChange(event, setRecipeName)

  const onSourceChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void =>
    onInputChange(event, setSource)

  const onIngredientQueryChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void =>
    onInputChange(event, setIngredientQuery)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>, setValue: (x: string) => void): void => {
    const textContent = event.target.value
    setValue(textContent)
  }

  const onSearchResultIngredientClick = (ingredient: Ingredient): void => {
    setChosenIngredients({
      ...chosenIngredients,
      [ingredient.id]: {
        ingredient,
        quantity: 0,
        unit: QUANTITY_UNITS[0]
      }
    })
    setIngredientQuery("")
  }

  const searchResults = ingredientQuery !== "" &&
    <div className={"IngredientsList-searchResults"}>
      {foundIngredients.map(ingredient =>
        <div
          className={"IngredientsList-searchResults--ingredient"}
          onClick={() => onSearchResultIngredientClick(ingredient)}
          key={ingredient.id}
        >
          {ingredient.name}
        </div>
      )}
    </div>

  const onRemoveIngredientClick = (ingredient: QuantifiedIngredient): void => {
    const newIngredients = { ...chosenIngredients }
    delete newIngredients[ingredient.ingredient.id]
    setChosenIngredients(newIngredients)
  }

  const onQuantityChange = (event: ChangeEvent<HTMLInputElement>, ingredient: QuantifiedIngredient): void => {
    setChosenIngredients({
      ...chosenIngredients,
      [ingredient.ingredient.id]: {
        ingredient: ingredient.ingredient,
        quantity: Number(event.target.value),
        unit: ingredient.unit,
      }
    })
  }

  const onUnitChange = (event: ChangeEvent<HTMLSelectElement>, ingredient: QuantifiedIngredient): void => {
    setChosenIngredients({
      ...chosenIngredients,
      [ingredient.ingredient.id]: {
        ingredient: ingredient.ingredient,
        quantity: ingredient.quantity,
        unit: event.target.value as QuantityUnit,
      }
    })
  }

  const ingredientsList = chosenIngredients !== {} &&
    <div className={"IngredientsList-ingredients"}>
      {Object.values(chosenIngredients).map((ingredient: QuantifiedIngredient) =>
        <div className={"IngredientsList-ingredients--ingredient"}>
          <i className="gg-close-r" onClick={() => onRemoveIngredientClick(ingredient)}/>
          <div>{ingredient.ingredient.name}</div>
          <input type="number" onChange={(event) => onQuantityChange(event, ingredient)}/>
          <select onChange={(event) => onUnitChange(event, ingredient)}>
            {QUANTITY_UNITS.map(unit => <option value={unit}>{formatUnit(ingredient.quantity, unit)}</option>)}
          </select>
        </div>
      )}
    </div>

  const onSaveRecipeClick = () => {
    NetworkService.addRecipe({
      name: recipeName,
      source: source,
      ingredients: Object.values(chosenIngredients).map(ingredient => ({
        id: ingredient.ingredient.id,
        unit: ingredient.unit,
        quantity: ingredient.quantity
      }))
    }).then(() => {
      setRecipeName("")
      setSource("")
      setChosenIngredients({})
    })
    .catch(() => alert("Wywaliło się :("))
  }

  return (
    <div className={"AddRecipe"}>
      <div className={"AddRecipe-header"}>
        {RecipesStrings.ADD_RECIPE_HEADER}
      </div>
      <input
        className={"AddRecipe-nameInput"}
        data-testid={"AddRecipe-nameInput"}
        placeholder={RecipesStrings.ADD_RECIPE_NAME_INPUT_PLACEHOLDER}
        onChange={onNameChange}
        value={recipeName}
      />
      <input
        className={"AddRecipe-ingredientsInput"}
        data-testid={"AddRecipe-ingredientsInput"}
        placeholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
        onChange={onIngredientQueryChange}
        value={ingredientQuery}
      />
      {searchResults}
      {ingredientsList}
      <input
        className={"AddRecipe-sourceInput"}
        data-testid={"AddRecipe-sourceInput"}
        placeholder={RecipesStrings.ADD_RECIPE_SOURCE_INPUT_PLACEHOLDER}
        onChange={onSourceChange}
        value={source}
      />
      <button className={"AddRecipe-save"} onClick={onSaveRecipeClick}>
        {RecipesStrings.ADD_RECIPE_SAVE}
      </button>
    </div>
  )
}

export default AddRecipe
