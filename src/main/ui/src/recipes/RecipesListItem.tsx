import { Ingredient, Recipe } from "./model";
import { formatUnit } from "./formatUnit";
import "./RecipesListItem.scss"

type RecipeListItemProps = {
  recipe: Recipe
}

const RecipesListItem = ({ recipe }: RecipeListItemProps): JSX.Element => {

  const getIngredientString = (ingredient: Ingredient) =>
    `${ingredient.name} ${ingredient.quantity} ${formatUnit(ingredient.quantity, ingredient.unit)}`;

  const ingredients = recipe.ingredients.map(ingredient => getIngredientString(ingredient)).join(", ");

  return (
    // todo: replace with recipe.id
    <div className={"RecipesListItem"} key={recipe.name}>
      <div className={"RecipesListItem-header"}>
        <div className={"RecipesListItem-header--name"}>
          {recipe.name.toUpperCase()}
        </div>
        <div className={"RecipesListItem-header--source"}>
          {recipe.source}
        </div>
      </div>
      <div className={"RecipesListItem-ingredients"}>
        {ingredients}
      </div>
    </div>
  )
}

export default RecipesListItem
