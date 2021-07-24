import { useEffect, useState } from "react";
import { NetworkServiceProvider } from "../networkService";
import { Recipe } from "./model";
import RecipesListItem from "./RecipesListItem";
import { RecipesStrings } from "../strings";
import "./RecipesList.scss"

type RecipesListProps = {
  networkService: NetworkServiceProvider
}

const RecipesList = ({ networkService }: RecipesListProps): JSX.Element => {

  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async (): Promise<void> => {
    const recipesResponse = await networkService.getRecipes();
    setRecipes(recipesResponse)
  }

  return (
    <div className={"RecipesList"}>
      <div className={"RecipesList-header"}>
        {RecipesStrings.RECIPES_LIST_HEADER}
      </div>
      {recipes.map(recipe => <RecipesListItem recipe={recipe}/>)}
    </div>
  )
}

export default RecipesList
