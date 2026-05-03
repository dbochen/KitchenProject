import { QuantifiedIngredient, Recipe, RecipeScores, Tag } from "./model";
import { formatUnit } from "./formatUnit";

const CATEGORY_LABELS: Record<string, string> = {
  OTHER_VEGETABLES: "Inne warzywa",
  NUTS_AND_SEEDS: "Orzechy i nasiona",
  GREENS: "Zielone liście",
  BEANS: "Strączki",
  OTHER_FRUITS: "Inne owoce",
  WHOLE_GRAINS: "Pełne ziarna",
  BERRIES: "Jagody",
  CRUCIFEROUS_VEGETABLES: "Warzywa krzyżowe",
  FLAXSEED: "Siemię lniane",
  HERBS_AND_SPICES: "Zioła i przyprawy"
}
import "./RecipesListItem.scss"
import classNames from 'classnames';
import { useState } from "react";
import EditRecipeModal from "./EditRecipeModal";

type RecipeListItemProps = {
  recipe: Recipe
  ingredients: Set<string>
  allTags: Tag[]
  scores?: RecipeScores
  selected: boolean
  hasUnitMismatch: boolean
  onRemoveRecipeClick: () => void
  onSelectClick: () => void
  onRecipeEdited: (updatedRecipe: Recipe) => void
}

const RecipesListItem = ({
                           recipe,
                           ingredients,
                           allTags,
                           scores,
                           selected,
                           hasUnitMismatch,
                           onRemoveRecipeClick,
                           onSelectClick,
                           onRecipeEdited,
                         }: RecipeListItemProps): JSX.Element => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const { name, id, quantifiedIngredients, source } = recipe;

  const getIngredientString = (ingredient: QuantifiedIngredient) => {
    const qty = Math.round(ingredient.quantity * 100) / 100;
    return `${ingredient.ingredient.name} ${qty} ${formatUnit(ingredient.quantity, ingredient.unit)}`;
  }

  const ingredientsString = quantifiedIngredients
    .map(ingredient => getIngredientString(ingredient))
    .join(", ");

  const matchedIngredients = quantifiedIngredients
    .filter(ingredient => ingredients.has(ingredient.ingredient.name))

  const missingIngredients = quantifiedIngredients
    .filter(qi =>
      !ingredients.has(qi.ingredient.name) &&
      !qi.substitutes.some(s => ingredients.has(s.name))
    )

  const ingredientsCompleteness = matchedIngredients.length / quantifiedIngredients.length;

  const headerClassNames = classNames(
    "RecipesListItem-header",
    !scores && { "RecipesListItem-header--complete": ingredientsCompleteness === 1 },
    !scores && { "RecipesListItem-header--partial": ingredientsCompleteness < 1 && ingredientsCompleteness >= 0.5 },
    !scores && { "RecipesListItem-header--missing": ingredientsCompleteness < 0.5 },
  )
  const headerStyle = scores
    ? { background: `hsl(${scores.standard * 120}, 65%, 45%)` }
    : undefined

  const onRemoveClick = () => {
    if (confirm(`Na pewno chcesz usunąć przepis ${name}?`)) {
      onRemoveRecipeClick()
    }
  }

  const wrapperClassNames = classNames(
    "RecipesListItem",
    { "RecipesListItem--selected": selected },
  )

  return (
    <div className={wrapperClassNames} key={id}>
      <div className={headerClassNames} style={headerStyle}>
        <div className={"RecipesListItem-header--name"}>
          {name.toUpperCase()}
        </div>
        <div className={"RecipesListItem-header--source"}>
          {source}
        </div>
        {recipe.tags?.length > 0 && (
          <div className={"RecipesListItem-header--tags"}>
            {recipe.tags.map(tag => (
              <span key={tag} className={"RecipesListItem-header--tags--chip"}>{tag}</span>
            ))}
          </div>
        )}
        <div className={"RecipesListItem-header--icons"}>
          {hasUnitMismatch && (
            <i
              className="gg-danger RecipesListItem-header--icons--mismatch"
              title="Niezgodność jednostek w inwentarzu"
            />
          )}
          <div className={"RecipesListItem-header--icons--pen"} onClick={() => setIsEditModalOpen(true)}>
            <i className="gg-pen"/>
          </div>
          <i className="gg-close-r" onClick={onRemoveClick}/>
          <i className="gg-arrow-right-o" onClick={onSelectClick}/>
        </div>
      </div>
      {scores && (
        <div className={"RecipesListItem-scores"}>
          {([
            { key: "ingredients", score: scores.ingredients, label: "Składniki" },
            { key: "balance", score: scores.balance, label: "Vata" },
            { key: "inflammation", score: scores.inflammation, label: "Przeciwzapalność" },
            { key: "servings", score: scores.servings, label: "Greger" },
          ] as const).map(({ key, score, label }) => (
            <div key={key} className={"RecipesListItem-scores--item"}>
              <div className={"RecipesListItem-scores--track"}>
                <div
                  className={"RecipesListItem-scores--fill"}
                  style={{ width: `${score * 100}%`, background: `hsl(${score * 120}, 70%, 45%)` }}
                />
              </div>
              <span className={"RecipesListItem-scores--label"}>{label}</span>
            </div>
          ))}
        </div>
      )}
      <div className={"RecipesListItem-ingredients"}>
        {ingredientsString}
      </div>
      {missingIngredients.length > 0 && (
        <div className={"RecipesListItem-missing"}>
          Brak: {missingIngredients.map(qi => qi.ingredient.name).join(", ")}
        </div>
      )}
      {recipe.lastCookedAt && (
    <div className={"RecipesListItem-lastCooked"}>
      Ostatnio użyte: {new Date(recipe.lastCookedAt).toLocaleDateString(
        'pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
    </div>
  )}
  {Object.keys(recipe.categoryServings).length > 0 && (
        <div className={"RecipesListItem-categoryServings"}>
          {Object.entries(recipe.categoryServings)
            .map(([cat, val]) => `${CATEGORY_LABELS[cat] ?? cat}: ${Math.round(val * 10) / 10}`)
            .join(" · ")}
        </div>
      )}
      {isEditModalOpen && (
        <EditRecipeModal
          recipe={recipe}
          allTags={allTags}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={onRecipeEdited}
        />
      )}
    </div>
  )
}

export default RecipesListItem
