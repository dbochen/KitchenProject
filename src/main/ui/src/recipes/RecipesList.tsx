import { Recipe } from "./model";
import RecipesListItem from "./RecipesListItem";
import { RecipesStrings } from "../strings";
import "./RecipesList.scss"

type RecipesListProps = {
  recipes: Recipe[]
}

const RecipesList = ({ recipes }: RecipesListProps): JSX.Element => {
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
