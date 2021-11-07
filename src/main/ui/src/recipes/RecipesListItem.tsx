import { Ingredient, QuantifiedIngredient, Recipe } from "./model";
import { formatUnit } from "./formatUnit";
import "./RecipesListItem.scss"
import classNames from 'classnames';

type RecipeListItemProps = {
  recipe: Recipe
  ingredients: Set<Ingredient>
}

const RecipesListItem = ({ recipe, ingredients }: RecipeListItemProps): JSX.Element => {

  const { name, id, quantifiedIngredients, source } = recipe;

  const getIngredientString = (ingredient: QuantifiedIngredient) =>
    `${ingredient.ingredient.name} ${ingredient.quantity} ${formatUnit(ingredient.quantity, ingredient.unit)}`;

  const ingredientsString = quantifiedIngredients
    .map(ingredient => getIngredientString(ingredient))
    .join(", ");

  const ingredientsNames = new Set(Array.from(ingredients).map(i => i.name))

  const matchedIngredients = quantifiedIngredients
    .filter(ingredient => ingredientsNames.has(ingredient.ingredient.name))

  const ingredientsCompleteness = matchedIngredients.length / quantifiedIngredients.length;

  const headerClassNames = classNames(
    "RecipesListItem-header",
    { "RecipesListItem-header--complete": ingredientsCompleteness === 1 },
    { "RecipesListItem-header--partial": ingredientsCompleteness < 1 && ingredientsCompleteness >= 0.5 },
    { "RecipesListItem-header--missing": ingredientsCompleteness < 0.5 }
  )

  return (
    <div className={"RecipesListItem"} key={id}>
      <div className={headerClassNames}>
        <div className={"RecipesListItem-header--name"}>
          {name.toUpperCase()}
        </div>
        <div className={"RecipesListItem-header--source"}>
          {source}
        </div>
      </div>
      <div className={"RecipesListItem-ingredients"}>
        {ingredientsString}
      </div>
    </div>
  )
}

export default RecipesListItem
