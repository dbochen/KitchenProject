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

  useEffect(() => {
    const ingredientsNames = new Set(Array.from(ingredients).map(i => i.name))

    const ingredientsWithDuplicates = recipes
      .flatMap(recipe => recipe.quantifiedIngredients)
      .map(qi => qi.ingredient);

    console.log(ingredientsWithDuplicates)

    const allIngredients: Ingredient[] = uniqBy(ingredientsWithDuplicates, (ingredient: Ingredient) => ingredient.name);

    console.log(allIngredients)

    const ingredientsPropositions = allIngredients
      .filter(ingredient => !ingredientsNames.has(ingredient.name))
      .slice(-10)

    setPropositions(ingredientsPropositions)
  }, [ingredients, recipes])

  return (
    <div className={"RecipesList"}>
      <div className={"IngredientsList-ingredients"}>
        {Array.from(propositions).map((ingredient: Ingredient) =>
          <div className={"IngredientsList-ingredients--ingredient"} key={ingredient.id}>
            <i className="gg-add-r" onClick={() => onAddIngredientClick(ingredient)}/>
            <div>{ingredient.name}</div>
          </div>
        )}
      </div>
      <div className={"RecipesList-header"}>
        {RecipesStrings.RECIPES_LIST_HEADER}
      </div>
      {recipes.map(recipe => <RecipesListItem recipe={recipe}/>)}
    </div>
  )
}

export default RecipesList
