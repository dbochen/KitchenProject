import React, { useEffect, useState } from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import IngredientsList from "./ingredients/IngredientsList";
import { Ingredient, Recipe } from "./recipes/model";
import { NetworkService } from "./NetworkService";

const App = (): JSX.Element => {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async (sort = ""): Promise<void> => {
    const recipesResponse = await NetworkService.getRecipes(sort);
    setRecipes(recipesResponse)
  }

  const onUpdateRecipesClick = (chosenIngredients: Set<Ingredient>) => {
    const sort = Array.from(chosenIngredients).map(ingredient => ingredient.id).join(',')
    fetchRecipes(sort)
  }

  return (
    <div className="App">
      <IngredientsList onUpdateRecipesClick={onUpdateRecipesClick}/>
      <RecipesList recipes={recipes}/>
    </div>
  )
}


export default App
