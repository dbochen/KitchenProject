import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { NetworkService, SortType } from "../NetworkService";
import { Ingredient } from "../recipes/model";
import { Search } from "../Search";
import classNames from "classnames";

type IngredientsListProps = {
  onUpdateRecipesClick: (sortType: SortType) => void
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
      {Array.from(ingredients).map((ingredient: Ingredient) => {
          const vataBalance = ingredient.vataBalance;
          const ingredientClassName = classNames(
            "IngredientsList-ingredients--ingredient",
            { "IngredientsList-ingredients--ingredient--very-balancing": vataBalance === "VERY_BALANCING" },
            { "IngredientsList-ingredients--ingredient--balancing": vataBalance === "BALANCING" },
            { "IngredientsList-ingredients--ingredient--aggravating": vataBalance === "AGGRAVATING" },
            { "IngredientsList-ingredients--ingredient--very-aggravating": vataBalance === "VERY_AGGRAVATING" },
          )
          return (
            <div
              className={ingredientClassName}
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
          )
        }
      )}
    </div>

  const updateRecipesByIngredientsButton =
    <button
      className={"IngredientsList-updateButton"}
      onClick={() => onUpdateRecipesClick("ingredients")}
      data-testid={'IngredientsList-ingredients--updateRecipes'}
    >
      Zaktualizuj przepisy po składnikach
    </button>

  const updateRecipesByCategoryButton =
    <button
      className={"IngredientsList-updateButton"}
      onClick={() => onUpdateRecipesClick("category")}
      data-testid={'IngredientsList-ingredients--updateRecipes'}
    >
      Zaktualizuj przepisy po kategorii
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
      {updateRecipesByIngredientsButton}
      {updateRecipesByCategoryButton}
      {clearIngredientsButton}
      {ingredientsList}
    </div>
  )
}

export default IngredientsList
