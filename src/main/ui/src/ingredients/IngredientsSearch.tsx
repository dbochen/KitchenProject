import { ChangeEvent, useEffect, useState } from "react";
import { Ingredient } from "../recipes/model";
import { RecipesStrings } from "../strings";
import { NetworkService } from "../NetworkService";

interface Props {
  onIngredientClick: (ingredient: Ingredient) => void
}

export const IngredientsSearch = ({ onIngredientClick }: Props): JSX.Element => {
  const [ingredientQuery, setIngredientQuery] = useState<string>("");
  const [foundIngredients, setFoundIngredients] = useState<Ingredient[]>([]);

  const fetchIngredients = async (query: string): Promise<void> => {
    const response = await NetworkService.getIngredients(query, 5);
    setFoundIngredients(response)
  }

  useEffect(() => {
    fetchIngredients(ingredientQuery);
  }, [ingredientQuery]);

  const onSearchResultIngredientClick = (ingredient: Ingredient): void => {
    onIngredientClick(ingredient)
    setIngredientQuery("")
  }

  const onIngredientQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const textContent = event.target.value
    setIngredientQuery(textContent)
  }

  return (
    <div>
      <input
        className={"IngredientsSearch-input"}
        data-testid={"IngredientsSearch-input"}
        placeholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
        onChange={onIngredientQueryChange}
        value={ingredientQuery}
      />
      {ingredientQuery !== "" &&
      <div className={"IngredientsSearch-searchResults"}>
        {foundIngredients.map(ingredient =>
          <div
            className={"IngredientsSearch-searchResults--ingredient"}
            onClick={() => onSearchResultIngredientClick(ingredient)}
            key={ingredient.id}
          >
            {ingredient.name}
          </div>
        )}
      </div>}
    </div>
  )
}
