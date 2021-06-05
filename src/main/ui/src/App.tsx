import React from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import { NetworkService } from "./networkService";
import IngredientsList from "./ingredients/IngredientsList";

const App = (): JSX.Element => {
  const networkService = new NetworkService()

  return (
    <div className="App">
      <IngredientsList networkService={networkService}/>
      <RecipesList networkService={networkService}/>
    </div>
  )
}


export default App
