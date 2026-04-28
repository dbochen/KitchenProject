import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { NetworkService } from "../NetworkService";
import { Ingredient } from "../recipes/model";
import { Search } from "../Search";

type IngredientsListProps = {
  onAddIngredientClick: (ingredient: Ingredient) => void
  onRemoveIngredientClick: (ingredient: Ingredient) => void
  ingredients: Set<Ingredient>
  onIngredientsClearClick: () => void
}

const IngredientsList = ({
                           onAddIngredientClick,
                           onRemoveIngredientClick,
                           ingredients,
                           onIngredientsClearClick
                         }: IngredientsListProps): JSX.Element => {

  const ingredientsList = ingredients.size !== 0 &&
    <div className={"IngredientsList-ingredients"}>
      {Array.from(ingredients).map((ingredient: Ingredient) => (
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
      ))}
    </div>

  return (
    <div className={"IngredientsList"}>
      <div className={"IngredientsList-header"}>
        {RecipesStrings.INGREDIENTS_LIST_HEADER}
      </div>
      <Search
        onItemClick={onAddIngredientClick}
        getItems={NetworkService.getIngredients}
        inputPlaceholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
      />
      <button
        className={"IngredientsList-updateButton"}
        onClick={onIngredientsClearClick}
        data-testid={'IngredientsList-ingredients--updateRecipes'}
      >
        {RecipesStrings.INGREDIENTS_CLEAR}
      </button>
      {ingredientsList}
    </div>
  )
}

export default IngredientsList
