import React, { useEffect, useState } from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import IngredientsList from "./ingredients/IngredientsList";
import { Ingredient, Recipe } from "./recipes/model";
import { NetworkService } from "./NetworkService";
import AddRecipe from "./recipes/AddRecipe";

const App = (): JSX.Element => {

  const INGREDIENTS_STORAGE_KEY = "kitchenApp.chosenIngredients"

  const getIngredientsFromStorage = (): Set<Ingredient> => {
    const savedIngredients = localStorage.getItem(INGREDIENTS_STORAGE_KEY)
    return savedIngredients ? new Set(JSON.parse(savedIngredients)) : new Set()
  }

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chosenIngredients, setChosenIngredients] = useState<Set<Ingredient>>(getIngredientsFromStorage());

  useEffect(() => {
    fetchRecipes()
  }, [])

  useEffect(() => {
    const chosenIngredientsAsString = JSON.stringify(Array.from(chosenIngredients))
    localStorage.setItem(INGREDIENTS_STORAGE_KEY, chosenIngredientsAsString)
  }, [chosenIngredients])

  const fetchRecipes = async (sort = ""): Promise<void> => {
    const recipesResponse = await NetworkService.getRecipes(sort);
    setRecipes(recipesResponse)
  }

  const onUpdateRecipesClick = () => {
    const sort = Array.from(chosenIngredients).map(ingredient => ingredient.id).join(',')
    fetchRecipes(sort)
  }

  const onAddIngredientClick = (ingredient: Ingredient) => {
    const newIngredients = new Set(chosenIngredients)
    newIngredients.add(ingredient)
    setChosenIngredients(newIngredients)
  }

  const onRemoveIngredientClick = (ingredient: Ingredient): void => {
    const newIngredients = new Set(chosenIngredients)
    newIngredients.delete(ingredient)
    setChosenIngredients(newIngredients)
  }

  const onIngredientsClearClick = (): void => {
    setChosenIngredients(new Set())
  }

  return (
    <div className="App">
      <IngredientsList
        ingredients={chosenIngredients}
        onUpdateRecipesClick={onUpdateRecipesClick}
        onAddIngredientClick={onAddIngredientClick}
        onRemoveIngredientClick={onRemoveIngredientClick}
        onIngredientsClearClick={onIngredientsClearClick}
      />
      <RecipesList recipes={recipes} ingredients={chosenIngredients} onAddIngredientClick={onAddIngredientClick}/>
      <AddRecipe/>
    </div>
  )
}


export default App
