import React, { useEffect, useState } from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import IngredientsList from "./ingredients/IngredientsList";
import { categoryToDailyServings, Ingredient, Recipe } from "./recipes/model";
import { NetworkService, Sort, SortType } from "./NetworkService";
import AddRecipe from "./recipes/AddRecipe";
import { AddTag } from "./tags/AddTag";
import { Menu } from "./menu/Menu";
import * as _ from "lodash";

const App = (): JSX.Element => {

  const INGREDIENTS_STORAGE_KEY = "kitchenApp.chosenIngredients"

  const getIngredientsFromStorage = (): Set<Ingredient> => {
    const savedIngredients = localStorage.getItem(INGREDIENTS_STORAGE_KEY)
    return savedIngredients ? new Set(JSON.parse(savedIngredients)) : new Set()
  }

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chosenIngredients, setChosenIngredients] = useState<Set<Ingredient>>(getIngredientsFromStorage());
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    fetchRecipes({ type: "ingredients", ingredients: "" })
  }, [])

  useEffect(() => {
    const chosenIngredientsAsString = JSON.stringify(Array.from(chosenIngredients))
    localStorage.setItem(INGREDIENTS_STORAGE_KEY, chosenIngredientsAsString)
  }, [chosenIngredients])

  const fetchRecipes = async (sort: Sort): Promise<void> => {
    const recipesResponse = await NetworkService.getRecipes(sort);
    setRecipes(sortRecipes(recipesResponse))
  }

  const sortRecipes = (recipesResponse: Recipe[]): Recipe[] => {

    const maxBalanceSum = _.maxBy(recipesResponse, (recipe: Recipe) => recipe.balanceSum)?.balanceSum
    const minBalanceSum = _.minBy(recipesResponse, (recipe: Recipe) => recipe.balanceSum)?.balanceSum

    const maxInflammationSum = _.maxBy(recipesResponse, (recipe: Recipe) => recipe.inflammationSum)?.inflammationSum
    const minInflammationSum = _.minBy(recipesResponse, (recipe: Recipe) => recipe.inflammationSum)?.inflammationSum

    const maxServings = _.maxBy(
      recipesResponse,
      (recipe: Recipe) => recipe.categoryServings[worstCategory]
    )?.categoryServings[worstCategory]
    const minServings = 0

    // 50% of cases use the standard formula
    if (Math.random() > 0.5) {
      console.log("Martyna - standard formula")
      return _.sortBy(recipesResponse, (recipe: Recipe) => {
        const matchedIngredients = recipe.quantifiedIngredients
          .filter(ingredient => chosenIngredientsNames.has(ingredient.ingredient.name))
        const matchedIngredientsNormalized = matchedIngredients.length / recipe.quantifiedIngredients.length
        const balanceSumNormalized = (recipe.balanceSum - minBalanceSum) /
          (maxBalanceSum - minBalanceSum)
        const InflammationSumNormalized = (recipe.inflammationSum - minInflammationSum) /
          (maxInflammationSum - minInflammationSum)
        const worstCategoryNormalized = (recipe.categoryServings[worstCategory] ?? 0 - minServings) /
          (maxServings - minServings)
        return -(
          matchedIngredientsNormalized
          + balanceSumNormalized
          - InflammationSumNormalized
          + worstCategoryNormalized
        )
      })
      // in 50% of cases do not use the formula
    } else {
      console.log("Martyna - custom formula")
      const random = Math.random()
      if (random < 0.25) {
        console.log("Martyna - sort by matched ingredients")
        return _.sortBy(recipesResponse, (recipe: Recipe) => {
          const matchedIngredients = recipe.quantifiedIngredients
            .filter(ingredient => chosenIngredientsNames.has(ingredient.ingredient.name))
          const matchedIngredientsNormalized = matchedIngredients.length / recipe.quantifiedIngredients.length
          return -matchedIngredientsNormalized
        })
      } else if (random < 0.5) {
        console.log("Martyna - sort by balance")
        return _.sortBy(recipesResponse, (recipe: Recipe) => {
          const balanceSumNormalized = (recipe.balanceSum - minBalanceSum) /
            (maxBalanceSum - minBalanceSum)
          return -balanceSumNormalized
        })
      } else if (random < 0.75) {
        console.log("Martyna - sort by inflammation")
        return _.sortBy(recipesResponse, (recipe: Recipe) => {
          const inflammationSumNormalized = (recipe.inflammationSum - minInflammationSum) /
            (maxInflammationSum - minInflammationSum)
          return inflammationSumNormalized
        })
      } else {
        console.log("Martyna - random")
        return _.sortBy(recipesResponse, (recipe: Recipe) => {
          return Math.random()
        })
      }
    }


  }

  const chosenIngredientsNames = new Set(Array.from(chosenIngredients).map(ci => ci.name));

  // xnormalized = (x - xminimum) / range of x

  const getCategoryToSelectedServings = () => {
    const categoryToSelectedServings: { [key: string]: number } = {};
    selectedRecipes.forEach(recipe => {
      Object.entries(recipe.categoryServings).forEach(([category, servings]) => {
        if (!categoryToSelectedServings[category]) {
          categoryToSelectedServings[category] = 0;
        }
        categoryToSelectedServings[category] += servings;
      })
    });
    return categoryToSelectedServings;
  }

  const categoryToSelectedServings = getCategoryToSelectedServings()

  const sortedCategoriesAndServings = Object.entries(categoryToDailyServings)
    .map(([category, dailyServings]) => {
      const required = dailyServings * 7;
      const total = categoryToSelectedServings[category] ?? 0;
      return ({ category, total, required, percentage: total / required });
    })
    .sort((a, b) => b.percentage - a.percentage);

  const worstCategory = sortedCategoriesAndServings[8].category

  const onUpdateRecipesClick = (sortType: SortType) => {
    const ingredients = Array.from(chosenIngredients).map(ingredient => ingredient.id).join(',');
    const sort: Sort = sortType === "ingredients" ?
      { type: "ingredients", ingredients } :
      { type: "category", ingredients, category: sortedCategoriesAndServings[8].category };
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

  const onRemoveRecipeClick = (recipe: Recipe) => {
    NetworkService.deleteRecipe(recipe)
      .then(() => {
        const newRecipes = recipes.filter(r => r.id !== recipe.id);
        setRecipes(newRecipes)
      })
      .catch(() => alert("Wywaliło się :("))
  }

  const onRecipeEdited = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
  }

  const onSelectRecipeClick = (recipe: Recipe) => {
    const index = selectedRecipes.findIndex(r => r.id === recipe.id)
    if (index > -1) {
      const newSelectedRecipes = [...selectedRecipes]
      newSelectedRecipes.splice(index, 1)
      setSelectedRecipes(newSelectedRecipes)
    } else {
      const newSelectedRecipes = [...selectedRecipes]
      newSelectedRecipes.push(recipe)
      setSelectedRecipes(newSelectedRecipes)
    }
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
      <RecipesList
        recipes={recipes}
        ingredients={chosenIngredients}
        onAddIngredientClick={onAddIngredientClick}
        onRemoveRecipeClick={onRemoveRecipeClick}
        onSelectRecipeClick={onSelectRecipeClick}
        onRecipeEdited={onRecipeEdited}
      />
      <div>
        <AddRecipe/>
        <AddTag/>
        <Menu categories={sortedCategoriesAndServings}/>
      </div>
    </div>
  )
}


export default App
