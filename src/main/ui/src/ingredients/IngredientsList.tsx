import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { NetworkServiceProvider } from "../networkService";

type IngredientsListProps = {
  networkService: NetworkServiceProvider
}

const IngredientsList = ({ networkService }: IngredientsListProps): JSX.Element => {

  const [foundIngredients, setFoundIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chosenIngredients, setChosenIngredients] = useState<Set<string>>(new Set());

  const fetchIngredients = async (query: string): Promise<void> => {
    const response = await networkService.getIngredients(query, 5);
    setFoundIngredients(response)
  }

  useEffect(() => {
    fetchIngredients(searchQuery);
  }, [searchQuery]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void => {
    const textContent = event.target.value
    setSearchQuery(textContent)
  }

  const onSearchResultIngredientClick = (ingredient: string): void => {
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
          key={ingredient}
        >
          {ingredient}
        </div>
      )}
    </div>

  const onRemoveIngredientClick = (ingredient: string): void => {
    const newIngredients = new Set(chosenIngredients)
    newIngredients.delete(ingredient)
    setChosenIngredients(newIngredients)
  }

  const ingredientsList = chosenIngredients.size !== 0 &&
    <div className={"IngredientsList-ingredients"}>
      {Array.from(chosenIngredients).map(ingredient =>
        <div className={"IngredientsList-ingredients--ingredient"}>
          <i className="gg-close-r" onClick={() => onRemoveIngredientClick(ingredient)}/>
          <div>{ingredient}</div>
        </div>
      )}
    </div>

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
      {ingredientsList}
    </div>
  )
}

export default IngredientsList
