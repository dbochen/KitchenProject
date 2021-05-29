import React from 'react'
import './App.css'
import RecipesList from "./recipes/RecipesList";
import { NetworkService } from "./networkService";

const App = (): JSX.Element =>
  <div className="App">
    <RecipesList networkService={new NetworkService()}/>
  </div>


export default App
