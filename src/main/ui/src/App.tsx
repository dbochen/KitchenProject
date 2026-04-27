import React, { useEffect, useMemo, useState } from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import IngredientsList from "./ingredients/IngredientsList";
import { categoryToDailyServings, Ingredient, Recipe, RecipeScores, Tag } from "./recipes/model";
import { NetworkService, Sort, SortType } from "./NetworkService";
import AddRecipe from "./recipes/AddRecipe";
import { AddTag } from "./tags/AddTag";
import { Menu } from "./menu/Menu";
import { SortStrategy } from "./recipes/SortStrategyPicker";
import * as _ from "lodash";

const normalize = (value: number, min: number, max: number): number =>
  max === min ? 0 : (value - min) / (max - min);

const avgBalance = (recipe: Recipe): number =>
  recipe.quantifiedIngredients.length > 0
    ? recipe.balanceSum / recipe.quantifiedIngredients.length
    : 0;

const avgInflammation = (recipe: Recipe): number =>
  recipe.quantifiedIngredients.length > 0
    ? recipe.inflammationSum / recipe.quantifiedIngredients.length
    : 0;

const sortRecipes = (
  recipesInput: Recipe[],
  strategy: SortStrategy,
  chosenIngredientsNames: Set<string>,
  worstCategory: string,
): Recipe[] => {
  if (strategy === "random") {
    return _.sortBy(recipesInput, () => Math.random());
  }

  const balanceAvgs = recipesInput.map(avgBalance);
  const inflammationAvgs = recipesInput.map(avgInflammation);
  const maxBalance = balanceAvgs.length > 0 ? Math.max(...balanceAvgs) : 0;
  const minBalance = balanceAvgs.length > 0 ? Math.min(...balanceAvgs) : 0;
  const maxInflammation = inflammationAvgs.length > 0 ? Math.max(...inflammationAvgs) : 0;
  const minInflammation = inflammationAvgs.length > 0 ? Math.min(...inflammationAvgs) : 0;
  const maxServings = _.maxBy(recipesInput, (r: Recipe) => r.categoryServings[worstCategory])
    ?.categoryServings[worstCategory] ?? 0;

  return _.sortBy(recipesInput, (recipe: Recipe) => {
    const matchedRatio = recipe.quantifiedIngredients.length > 0
      ? recipe.quantifiedIngredients.filter(qi => chosenIngredientsNames.has(qi.ingredient.name)).length
        / recipe.quantifiedIngredients.length
      : 0;
    const balanceNorm = normalize(avgBalance(recipe), minBalance, maxBalance);
    const inflammationNorm = normalize(avgInflammation(recipe), minInflammation, maxInflammation);
    const servingsNorm = normalize(recipe.categoryServings[worstCategory] ?? 0, 0, maxServings);

    const standardScore = matchedRatio + balanceNorm - inflammationNorm + servingsNorm;
    if (strategy === "ingredients") return -(matchedRatio * 1000 + standardScore);
    if (strategy === "balance") return -(balanceNorm * 1000 + standardScore);
    if (strategy === "inflammation") return inflammationNorm * 1000 - standardScore;
    return -standardScore;
  });
};

const App = (): JSX.Element => {

  const INGREDIENTS_STORAGE_KEY = "kitchenApp.chosenIngredients"

  const getIngredientsFromStorage = (): Set<Ingredient> => {
    const savedIngredients = localStorage.getItem(INGREDIENTS_STORAGE_KEY)
    return savedIngredients ? new Set(JSON.parse(savedIngredients)) : new Set()
  }

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [chosenIngredients, setChosenIngredients] = useState<Set<Ingredient>>(getIngredientsFromStorage());
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set())
  const [sortStrategy, setSortStrategy] = useState<SortStrategy>("standard")

  useEffect(() => {
    fetchRecipes({ type: "ingredients", ingredients: "" })
    NetworkService.getTags().then(setAllTags)
  }, [])

  useEffect(() => {
    const chosenIngredientsAsString = JSON.stringify(Array.from(chosenIngredients))
    localStorage.setItem(INGREDIENTS_STORAGE_KEY, chosenIngredientsAsString)
  }, [chosenIngredients])

  const fetchRecipes = async (sort: Sort): Promise<void> => {
    const recipesResponse = await NetworkService.getRecipes(sort);
    setRecipes(recipesResponse)
  }

  const chosenIngredientsNames = useMemo(
    () => new Set(Array.from(chosenIngredients).map(ci => ci.name)),
    [chosenIngredients]
  );

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

  const sortedRecipes = useMemo(
    () => sortRecipes(recipes, sortStrategy, chosenIngredientsNames, worstCategory),
    [recipes, sortStrategy, chosenIngredientsNames, worstCategory]
  );

  const recipeScores = useMemo((): Map<number, RecipeScores> => {
    const balanceAvgs = recipes.map(avgBalance);
    const inflammationAvgs = recipes.map(avgInflammation);
    const maxBalance = balanceAvgs.length > 0 ? Math.max(...balanceAvgs) : 0;
    const minBalance = balanceAvgs.length > 0 ? Math.min(...balanceAvgs) : 0;
    const maxInflammation = inflammationAvgs.length > 0 ? Math.max(...inflammationAvgs) : 0;
    const minInflammation = inflammationAvgs.length > 0 ? Math.min(...inflammationAvgs) : 0;
    const maxServings = _.maxBy(recipes, (r: Recipe) => r.categoryServings[worstCategory])
      ?.categoryServings[worstCategory] ?? 0;

    const partial = recipes.map((recipe, i) => {
      const ingredients = recipe.quantifiedIngredients.length > 0
        ? recipe.quantifiedIngredients
            .filter(qi => chosenIngredientsNames.has(qi.ingredient.name)).length
          / recipe.quantifiedIngredients.length
        : 0;
      const balance = normalize(balanceAvgs[i], minBalance, maxBalance);
      const inflammation = 1 - normalize(inflammationAvgs[i], minInflammation, maxInflammation);
      const servings = normalize(recipe.categoryServings[worstCategory] ?? 0, 0, maxServings);
      return { id: recipe.id, ingredients, balance, inflammation, servings };
    });

    const standardRaws = partial.map(s => s.ingredients + s.balance + s.inflammation + s.servings);
    const minStandard = Math.min(...standardRaws);
    const maxStandard = Math.max(...standardRaws);

    return new Map(partial.map((s, i) => [
      s.id,
      { ...s, standard: normalize(standardRaws[i], minStandard, maxStandard) },
    ]));
  }, [recipes, chosenIngredientsNames, worstCategory]);

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

  const onTagToggle = (tag: Tag) => {
    const updated = new Set(selectedTagIds)
    updated.has(tag.id) ? updated.delete(tag.id) : updated.add(tag.id)
    setSelectedTagIds(updated)
  }

  const filteredRecipes = selectedTagIds.size === 0
    ? sortedRecipes
    : sortedRecipes.filter(recipe =>
        Array.from(selectedTagIds).some(tagId => {
          const tag = allTags.find(t => t.id === tagId)
          return tag && recipe.tags?.includes(tag.name)
        })
      )

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
        recipes={filteredRecipes}
        ingredients={chosenIngredients}
        allTags={allTags}
        selectedTagIds={selectedTagIds}
        sortStrategy={sortStrategy}
        recipeScores={recipeScores}
        onTagToggle={onTagToggle}
        onSortStrategyChange={setSortStrategy}
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
