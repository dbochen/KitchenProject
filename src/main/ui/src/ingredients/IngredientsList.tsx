import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { NetworkService } from "../NetworkService";
import { Ingredient } from "../recipes/model";

type IngredientsListProps = {
  onUpdateRecipesClick: (chosenIngredients: Set<Ingredient>) => void,
}

const IngredientsList = ({ onUpdateRecipesClick }: IngredientsListProps): JSX.Element => {

  const [foundIngredients, setFoundIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chosenIngredients, setChosenIngredients] = useState<Set<Ingredient>>(new Set());

  const fetchIngredients = async (query: string): Promise<void> => {
    const response = await NetworkService.getIngredients(query, 5);
    setFoundIngredients(response)
  }

  useEffect(() => {
    fetchIngredients(searchQuery);
  }, [searchQuery]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void => {
    const textContent = event.target.value
    setSearchQuery(textContent)
  }

  const onSearchResultIngredientClick = (ingredient: Ingredient): void => {
    const newIngredients = new Set(chosenIngredients)
    newIngredients.add(ingredient)
    setChosenIngredients(newIngredients)
  }

  const searchResults = searchQuery !== "" &&
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

  const onRemoveIngredientClick = (ingredient: Ingredient): void => {
    const newIngredients = new Set(chosenIngredients)
    newIngredients.delete(ingredient)
    setChosenIngredients(newIngredients)
  }

  const ingredientsList = chosenIngredients.size !== 0 &&
    <div className={"IngredientsList-ingredients"}>
      {Array.from(chosenIngredients).map((ingredient: Ingredient) =>
        <div className={"IngredientsList-ingredients--ingredient"}>
          <i className="gg-close-r" onClick={() => onRemoveIngredientClick(ingredient)}/>
          <div>{ingredient.name}</div>
        </div>
      )}
    </div>

  const updateRecipesButton =
    <button onClick={() => onUpdateRecipesClick(chosenIngredients)}>
      {RecipesStrings.INGREDIENTS_UPDATE_RECIPES}
    </button>

  return (
    <div className={"IngredientsList"}>
      <div className={"IngredientsList-header"}>
        {RecipesStrings.INGREDIENTS_LIST_HEADER}
      </div>
      <i className="gg-search"/>
      <input
        className={"IngredientsList-input"}
        data-testid={"IngredientsList-input"}
        placeholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
        onChange={onInputChange}
      />
      {searchResults}
      {updateRecipesButton}
      {ingredientsList}
    </div>
  )
}

export default IngredientsList
