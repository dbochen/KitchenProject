import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { NetworkService } from "../NetworkService";
import { Ingredient } from "../recipes/model";
import { Search } from "../Search";

type IngredientsListProps = {
  onUpdateRecipesClick: (chosenIngredients: Set<Ingredient>) => void
  onAddIngredientClick: (ingredient: Ingredient) => void
  onRemoveIngredientClick: (ingredient: Ingredient) => void
  ingredients: Set<Ingredient>
  onIngredientsClearClick: () => void
}

const IngredientsList = ({
                           onUpdateRecipesClick,
                           onAddIngredientClick,
                           onRemoveIngredientClick,
                           ingredients,
                           onIngredientsClearClick
                         }: IngredientsListProps): JSX.Element => {

  const onSearchResultIngredientClick = (ingredient: Ingredient): void => {
    onAddIngredientClick(ingredient)
  }

  const ingredientsList = ingredients.size !== 0 &&
    <div className={"IngredientsList-ingredients"}>
      {Array.from(ingredients).map((ingredient: Ingredient) =>
        <div
          className={"IngredientsList-ingredients--ingredient"}
          key={ingredient.id}
          data-testid={`IngredientsList-ingredients--ingredient-${ingredient.name}`}
        >
          <i
            className="gg-close-r"
            onClick={() => onRemoveIngredientClick(ingredient)}
            data-testid={`IngredientsList-ingredients--removeIngredient-${ingredient.name}`}
          />
          <div>{ingredient.name}</div>
        </div>
      )}
    </div>

  const updateRecipesButton =
    <button
      className={"IngredientsList-updateButton"}
      onClick={() => onUpdateRecipesClick(ingredients)}
      data-testid={'IngredientsList-ingredients--updateRecipes'}
    >
      {RecipesStrings.INGREDIENTS_UPDATE_RECIPES}
    </button>

  const clearIngredientsButton =
    <button
      className={"IngredientsList-updateButton"}
      onClick={onIngredientsClearClick}
      data-testid={'IngredientsList-ingredients--updateRecipes'}
    >
      {RecipesStrings.INGREDIENTS_CLEAR}
    </button>


  return (
    <div className={"IngredientsList"}>
      <div className={"IngredientsList-header"}>
        {RecipesStrings.INGREDIENTS_LIST_HEADER}
      </div>
      <Search
        onItemClick={onSearchResultIngredientClick}
        getItems={NetworkService.getIngredients}
        inputPlaceholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
      />
      {updateRecipesButton}
      {clearIngredientsButton}
      {ingredientsList}
    </div>
  )
}

export default IngredientsList
