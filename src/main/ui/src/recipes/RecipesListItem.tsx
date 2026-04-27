import { Ingredient, QuantifiedIngredient, Recipe } from "./model";
import { formatUnit } from "./formatUnit";
import "./RecipesListItem.scss"
import classNames from 'classnames';
import { useState } from "react";
import EditRecipeModal from "./EditRecipeModal";

type RecipeListItemProps = {
  recipe: Recipe
  ingredients: Set<Ingredient>
  onRemoveRecipeClick: () => void
  onSelectClick: () => void
  onRecipeEdited: (updatedRecipe: Recipe) => void
}

const RecipesListItem = ({
                           recipe,
                           ingredients,
                           onRemoveRecipeClick,
                           onSelectClick,
                           onRecipeEdited,
                         }: RecipeListItemProps): JSX.Element => {

  const [selected, setSelected] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const { name, id, quantifiedIngredients, source, categoryServings, balanceSum, inflammationSum } = recipe;

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

  const onRemoveClick = () => {
    if (confirm(`Na pewno chcesz usunąć przepis ${name}?`)) {
      onRemoveRecipeClick()
    }
  }

  const onselectButtonClick = ()  => {
    setSelected(!selected)
    onSelectClick()
  }

  const wrapperClassNames = classNames(
    "RecipesListItem",
    { "RecipesListItem--selected": selected },
  )

  return (
    <div className={wrapperClassNames} key={id}>
      <div className={headerClassNames}>
        <div className={"RecipesListItem-header--name"}>
          {name.toUpperCase()}
        </div>
        <div className={"RecipesListItem-header--source"}>
          {source}
        </div>
        {/*<div className={"RecipesListItem-header--servings"}>*/}
        {/*  {Object.entries(categoryServings)*/}
        {/*    .map(([category, serving]) => `${category}: ${serving.toFixed(1)}`)*/}
        {/*    .join(', ')}*/}
        {/*</div>*/}
        {/*<div className={"RecipesListItem-header--servings"}>*/}
        {/*  {`balans: ${balanceSum}`}*/}
        {/*  {` zapalnosc: ${inflammationSum}`}*/}
        {/*</div>*/}
        <div className={"RecipesListItem-header--icons"}>
          <div className={"RecipesListItem-header--icons--pen"} onClick={() => setIsEditModalOpen(true)}>
            <i className="gg-pen"/>
          </div>
          <i className="gg-close-r" onClick={onRemoveClick}/>
          <i className="gg-arrow-right-o" onClick={onselectButtonClick}/>
        </div>
      </div>
      <div className={"RecipesListItem-ingredients"}>
        {`${ingredientsString} (${matchedIngredients.length}/${quantifiedIngredients.length})`}
      </div>
      {isEditModalOpen && (
        <EditRecipeModal
          recipe={recipe}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={onRecipeEdited}
        />
      )}
    </div>
  )
}

export default RecipesListItem