import { Ingredient, Recipe } from "./model";
import RecipesListItem from "./RecipesListItem";
import { RecipesStrings } from "../strings";
import "./RecipesList.scss"
import { useEffect, useState } from "react";
import { uniqBy } from "lodash"

type RecipesListProps = {
  recipes: Recipe[]
  ingredients: Set<Ingredient>
  onAddIngredientClick: (ingredient: Ingredient) => void
}

const RecipesList = ({ recipes, ingredients, onAddIngredientClick }: RecipesListProps): JSX.Element => {

  const [propositions, setPropositions] = useState<Ingredient[]>([])
  const [rejectedPropositions, setRejectedPropositions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const ingredientsNames = new Set(Array.from(ingredients).map(i => i.name))

    const ingredientsWithDuplicates = recipes
      .flatMap(recipe => recipe.quantifiedIngredients)
      .map(qi => qi.ingredient);

    const allIngredients: Ingredient[] = uniqBy(ingredientsWithDuplicates, (ingredient: Ingredient) => ingredient.name);

    const ingredientsPropositions = allIngredients
      .filter(ingredient => !ingredientsNames.has(ingredient.name) && !rejectedPropositions.has(ingredient.name))
      .slice(0,5)

    setPropositions(ingredientsPropositions)
  }, [ingredients, recipes, rejectedPropositions])

  const onRemovePropositionClick = (ingredient: Ingredient) => {
    setRejectedPropositions(new Set([...Array.from(rejectedPropositions), ingredient.name]))
  }

  return (
    <div className={"RecipesList"}>
      <div className={"IngredientsList-ingredients"}>
        {Array.from(propositions).map((ingredient: Ingredient) =>
          <div className={"IngredientsList-ingredients--ingredient"} key={ingredient.id} data-testid={`RecipesList-propositions--${ingredient.name}`}>
            <i className="gg-add-r" onClick={() => onAddIngredientClick(ingredient)}/>
            <div>{ingredient.name}</div>
            <i className="gg-close-r" onClick={() => onRemovePropositionClick(ingredient)}/>
          </div>
        )}
      </div>
      <div className={"RecipesList-header"}>
        {RecipesStrings.RECIPES_LIST_HEADER}
      </div>
      {recipes.map(recipe => <RecipesListItem recipe={recipe} ingredients={ingredients}/>)}
    </div>
  )
}

export default RecipesList
