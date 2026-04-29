import { Ingredient, Recipe, RecipeScores, Tag } from "./model";
import RecipesListItem from "./RecipesListItem";
import { RecipesStrings } from "../strings";
import "./RecipesList.scss"
import { useEffect, useState } from "react";
import { uniqBy } from "lodash"
import TagFilter from "../tags/TagFilter";
import SortStrategyPicker, { SortStrategy } from "./SortStrategyPicker";

type RecipesListProps = {
  recipes: Recipe[]
  ingredients: Set<string>
  inventoryIngredientNames: Set<string>
  allTags: Tag[]
  selectedTagIds: Set<number>
  selectedRecipeIds: Set<number>
  recipesWithMismatch: Set<number>
  sortStrategy: SortStrategy
  recipeScores: Map<number, RecipeScores>
  onTagToggle: (tag: Tag) => void
  onSortStrategyChange: (strategy: SortStrategy) => void
  onAddToInventory: (ingredient: Ingredient) => void
  onRemoveRecipeClick: (recipe: Recipe) => void
  onSelectRecipeClick: (recipe: Recipe) => void
  onRecipeEdited: (updatedRecipe: Recipe) => void
}

const RecipesList = ({
                       recipes,
                       ingredients,
                       inventoryIngredientNames,
                       allTags,
                       selectedTagIds,
                       selectedRecipeIds,
                       recipesWithMismatch,
                       sortStrategy,
                       recipeScores,
                       onTagToggle,
                       onSortStrategyChange,
                       onAddToInventory,
                       onRemoveRecipeClick,
                       onSelectRecipeClick,
                       onRecipeEdited,
                     }: RecipesListProps): JSX.Element => {

  const [propositions, setPropositions] = useState<Ingredient[]>([])
  const [
    rejectedPropositions,
    setRejectedPropositions
  ] = useState<Set<string>>(new Set())

  useEffect(() => {
    const ingredientsWithDuplicates = recipes
      .flatMap(recipe => recipe.quantifiedIngredients)
      .map(qi => qi.ingredient);

    const allIngredients: Ingredient[] = uniqBy(ingredientsWithDuplicates, (ingredient: Ingredient) => ingredient.name);

    const ingredientsPropositions = allIngredients
      .filter(ingredient => !inventoryIngredientNames.has(ingredient.name)
        && !rejectedPropositions.has(ingredient.name
        ))
      .slice(0, 5)

    setPropositions(ingredientsPropositions)
  }, [inventoryIngredientNames, recipes, rejectedPropositions])

  const onRemovePropositionClick = (ingredient: Ingredient) => {
    setRejectedPropositions(new Set([...Array.from(rejectedPropositions), ingredient.name]))
  }

  return (
    <div className={"RecipesList"}>
      <div className={"IngredientsList-ingredients"}>
        {Array.from(propositions).map((ingredient: Ingredient) =>
          <div
            className={"IngredientsList-ingredients--ingredient"}
            key={ingredient.id}
            data-testid={`RecipesList-propositions--${ingredient.name}`}
          >
            <i className="gg-add-r" onClick={() => onAddToInventory(ingredient)}/>
            <i className="gg-close-r" onClick={() => onRemovePropositionClick(ingredient)}/>
            <div>{ingredient.name}</div>
          </div>
        )}
      </div>
      <div className={"RecipesList-header"}>
        {RecipesStrings.RECIPES_LIST_HEADER}
      </div>
      <SortStrategyPicker selected={sortStrategy} onChange={onSortStrategyChange}/>
      <TagFilter allTags={allTags} selectedTagIds={selectedTagIds} onTagToggle={onTagToggle}/>
      {recipes.map(recipe => <RecipesListItem
          recipe={recipe}
          ingredients={ingredients}
          allTags={allTags}
          scores={recipeScores.get(recipe.id)}
          selected={selectedRecipeIds.has(recipe.id)}
          hasUnitMismatch={recipesWithMismatch.has(recipe.id)}
          onRemoveRecipeClick={() => onRemoveRecipeClick(recipe)}
          onSelectClick={() => onSelectRecipeClick(recipe)}
          onRecipeEdited={onRecipeEdited}
          key={recipe.id}
        />
      )}
    </div>
  )
}

export default RecipesList
