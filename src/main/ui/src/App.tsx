import React, { useEffect, useMemo, useState } from 'react'
import './App.scss'
import RecipesList from "./recipes/RecipesList";
import IngredientsList from "./ingredients/IngredientsList";
import {
  categoryToDailyServings, Ingredient, InventoryItem,
  QUANTITY_UNITS, QuantityUnit, Recipe, RecipeScores, Tag
} from "./recipes/model";
import { NetworkService, Sort } from "./NetworkService";
import EditRecipeModal from "./recipes/EditRecipeModal";
import { AddTag } from "./tags/AddTag";
import { Menu } from "./menu/Menu";
import ShoppingList from "./ingredients/ShoppingList";
import { SortStrategy } from "./recipes/SortStrategyPicker";
import { areCompatibleUnits, convertToUnit } from "./convertUnits";
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

const gregersScore = (recipe: Recipe, categoryDeficiencies: Record<string, number>): number =>
  Object.entries(categoryDeficiencies).reduce(
    (sum, [cat, def]) => sum + (recipe.categoryServings[cat] ?? 0) * def, 0
  );

const sortRecipes = (
  recipesInput: Recipe[],
  strategy: SortStrategy,
  chosenIngredientsNames: Set<string>,
  categoryDeficiencies: Record<string, number>,
  randomSortKeys: Map<number, number>,
  perishableIngredientNames: Set<string>,
): Recipe[] => {
  const perishableBonus = (recipe: Recipe) =>
    recipe.quantifiedIngredients.filter(qi => perishableIngredientNames.has(qi.ingredient.name)).length * 5;

  if (strategy === "random") {
    return _.sortBy(recipesInput, (r: Recipe) => (randomSortKeys.get(r.id) ?? 0) - perishableBonus(r));
  }

  const balanceAvgs = recipesInput.map(avgBalance);
  const inflammationAvgs = recipesInput.map(avgInflammation);
  const maxBalance = balanceAvgs.length > 0 ? Math.max(...balanceAvgs) : 0;
  const minBalance = balanceAvgs.length > 0 ? Math.min(...balanceAvgs) : 0;
  const maxInflammation = inflammationAvgs.length > 0 ? Math.max(...inflammationAvgs) : 0;
  const minInflammation = inflammationAvgs.length > 0 ? Math.min(...inflammationAvgs) : 0;
  const gregersMap = new Map(
    recipesInput.map(r => [r.id, gregersScore(r, categoryDeficiencies)])
  );
  const maxGregers = Math.max(0, ...Array.from(gregersMap.values()));

  return _.sortBy(recipesInput, (recipe: Recipe) => {
    const matchedRatio = recipe.quantifiedIngredients.length > 0
      ? recipe.quantifiedIngredients.filter(qi => chosenIngredientsNames.has(qi.ingredient.name)).length
        / recipe.quantifiedIngredients.length
      : 0;
    const balanceNorm = normalize(avgBalance(recipe), minBalance, maxBalance);
    const inflammationNorm = normalize(avgInflammation(recipe), minInflammation, maxInflammation);
    const servingsNorm = normalize(gregersMap.get(recipe.id) ?? 0, 0, maxGregers);

    const standardScore = matchedRatio + balanceNorm - inflammationNorm + servingsNorm;
    const urgent = perishableBonus(recipe);
    if (strategy === "ingredients") return -(matchedRatio * 1000 + standardScore + urgent);
    if (strategy === "balance") return -(balanceNorm * 1000 + standardScore + urgent);
    if (strategy === "inflammation") return inflammationNorm * 1000 - standardScore - urgent;
    if (strategy === "servings") return -(servingsNorm * 1000 + standardScore + urgent);
    return -(standardScore + urgent);
  });
};

const INVENTORY_STORAGE_KEY = "kitchenApp.inventory"

const getInventoryFromStorage = (): Map<number, InventoryItem> => {
  const saved = localStorage.getItem(INVENTORY_STORAGE_KEY)
  if (!saved) return new Map()
  return new Map(JSON.parse(saved))
}

const App = (): JSX.Element => {

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [inventory, setInventory] = useState<Map<number, InventoryItem>>(getInventoryFromStorage)
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set())
  const [sortStrategy, setSortStrategy] = useState<SortStrategy>("standard")
  const [randomSortKeys, setRandomSortKeys] = useState<Map<number, number>>(new Map())
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchRecipes({ type: "ingredients", ingredients: "" })
    NetworkService.getTags().then(setAllTags)
  }, [])

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(Array.from(inventory.entries())))
  }, [inventory])

  useEffect(() => {
    setRandomSortKeys(prev => {
      const recipeIdSet = new Set(recipes.map(r => r.id))
      const next = new Map(prev)
      let changed = false
      recipes.forEach(r => {
        if (!next.has(r.id)) { next.set(r.id, Math.random()); changed = true }
      })
      Array.from(next.keys()).forEach(id => {
        if (!recipeIdSet.has(id)) { next.delete(id); changed = true }
      })
      return changed ? next : prev
    })
  }, [recipes])

  const fetchRecipes = async (sort: Sort): Promise<void> => {
    const recipesResponse = await NetworkService.getRecipes(sort);
    setRecipes(recipesResponse)
  }

  const projectedInventory = useMemo(() => {
    const projected = new Map<number, number>()
    inventory.forEach((item, id) => projected.set(id, item.quantity))
    selectedRecipes.forEach(recipe => {
      recipe.quantifiedIngredients.forEach(qi => {
        const inv = inventory.get(qi.ingredient.id)
        if (inv) {
          const converted = convertToUnit(qi.quantity, qi.unit, inv.unit)
          if (converted !== null) {
            projected.set(qi.ingredient.id, (projected.get(qi.ingredient.id) ?? 0) - converted)
          }
        }
      })
    })
    return projected
  }, [inventory, selectedRecipes])

  const chosenIngredientsNames = useMemo(() => {
    const names = new Set<string>()
    inventory.forEach(item => {
      if ((projectedInventory.get(item.ingredient.id) ?? 0) > 0) {
        names.add(item.ingredient.name)
      }
    })
    return names
  }, [inventory, projectedInventory])

  const recipesWithMismatch = useMemo(() => {
    const result = new Set<number>()
    recipes.forEach(recipe => {
      const hasMismatch = recipe.quantifiedIngredients.some(qi => {
        const inv = inventory.get(qi.ingredient.id)
        return inv && !areCompatibleUnits(inv.unit, qi.unit)
      })
      if (hasMismatch) result.add(recipe.id)
    })
    return result
  }, [recipes, inventory])

  const shoppingListDeficits = useMemo(() => {
    const deficits: { ingredient: Ingredient, deficit: number, unit: QuantityUnit }[] = []
    projectedInventory.forEach((projected, id) => {
      if (projected < 0) {
        const item = inventory.get(id)
        if (item) deficits.push({ ingredient: item.ingredient, deficit: -projected, unit: item.unit })
      }
    })
    return deficits
  }, [projectedInventory, inventory])

  const shoppingListMismatches = useMemo(() => {
    const seen = new Set<number>()
    const mismatches: { ingredient: Ingredient, inventoryUnit: QuantityUnit, recipeUnit: QuantityUnit }[] = []
    selectedRecipes.forEach(recipe => {
      recipe.quantifiedIngredients.forEach(qi => {
        const inv = inventory.get(qi.ingredient.id)
        if (inv && !areCompatibleUnits(inv.unit, qi.unit) && !seen.has(qi.ingredient.id)) {
          seen.add(qi.ingredient.id)
          mismatches.push({ ingredient: qi.ingredient, inventoryUnit: inv.unit, recipeUnit: qi.unit })
        }
      })
    })
    return mismatches
  }, [selectedRecipes, inventory])

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

  const categoryDeficiencies = useMemo((): Record<string, number> => {
    const totalByCategory: Record<string, number> = {};
    selectedRecipes.forEach(recipe => {
      Object.entries(recipe.categoryServings).forEach(([category, servings]) => {
        totalByCategory[category] = (totalByCategory[category] ?? 0) + servings;
      });
    });
    return Object.fromEntries(
      Object.entries(categoryToDailyServings).map(([category, dailyServings]) => {
        const required = dailyServings * 7;
        return [category, Math.max(0, 1 - (totalByCategory[category] ?? 0) / required)];
      })
    );
  }, [selectedRecipes]);

  const perishableIngredientNames = useMemo(() => {
    const names = new Set<string>()
    inventory.forEach(item => {
      if (item.perishable && (projectedInventory.get(item.ingredient.id) ?? 0) > 0)
        names.add(item.ingredient.name)
    })
    return names
  }, [inventory, projectedInventory])

  const sortedRecipes = useMemo(
    () => sortRecipes(
      recipes, sortStrategy, chosenIngredientsNames, categoryDeficiencies, randomSortKeys, perishableIngredientNames
    ),
    [recipes, sortStrategy, chosenIngredientsNames, categoryDeficiencies, randomSortKeys, perishableIngredientNames]
  );

  const recipeScores = useMemo((): Map<number, RecipeScores> => {
    const balanceAvgs = recipes.map(avgBalance);
    const inflammationAvgs = recipes.map(avgInflammation);
    const maxBalance = balanceAvgs.length > 0 ? Math.max(...balanceAvgs) : 0;
    const minBalance = balanceAvgs.length > 0 ? Math.min(...balanceAvgs) : 0;
    const maxInflammation = inflammationAvgs.length > 0 ? Math.max(...inflammationAvgs) : 0;
    const minInflammation = inflammationAvgs.length > 0 ? Math.min(...inflammationAvgs) : 0;
    const gregersRaws = recipes.map(r => gregersScore(r, categoryDeficiencies));
    const maxGregers = Math.max(0, ...gregersRaws);

    const partial = recipes.map((recipe, i) => {
      const ingredients = recipe.quantifiedIngredients.length > 0
        ? recipe.quantifiedIngredients
            .filter(qi => chosenIngredientsNames.has(qi.ingredient.name)).length
          / recipe.quantifiedIngredients.length
        : 0;
      const balance = normalize(balanceAvgs[i], minBalance, maxBalance);
      const inflammation = 1 - normalize(inflammationAvgs[i], minInflammation, maxInflammation);
      const servings = normalize(gregersRaws[i], 0, maxGregers);
      return { id: recipe.id, ingredients, balance, inflammation, servings };
    });

    const standardRaws = partial.map(s => s.ingredients + s.balance + s.inflammation + s.servings);
    const minStandard = Math.min(...standardRaws);
    const maxStandard = Math.max(...standardRaws);

    return new Map(partial.map((s, i) => [
      s.id,
      { ...s, standard: normalize(standardRaws[i], minStandard, maxStandard) },
    ]));
  }, [recipes, chosenIngredientsNames, categoryDeficiencies]);

  const onAddToInventory = (ingredient: Ingredient) => {
    if (!inventory.has(ingredient.id)) {
      const next = new Map(inventory)
      next.set(ingredient.id, { ingredient, quantity: 0, unit: QUANTITY_UNITS[0] })
      setInventory(next)
    }
  }

  const onRemoveFromInventory = (ingredient: Ingredient) => {
    const next = new Map(inventory)
    next.delete(ingredient.id)
    setInventory(next)
  }

  const onUpdateInventoryItem = (ingredientId: number, quantity: number, unit: QuantityUnit) => {
    const item = inventory.get(ingredientId)
    if (!item) return
    const next = new Map(inventory)
    next.set(ingredientId, { ...item, quantity, unit })
    setInventory(next)
  }

  const onTogglePerishable = (ingredient: Ingredient) => {
    const item = inventory.get(ingredient.id)
    if (!item) return
    const next = new Map(inventory)
    next.set(ingredient.id, { ...item, perishable: !item.perishable })
    setInventory(next)
  }

  const onDeleteIngredient = (ingredient: Ingredient) => {
    NetworkService.deleteIngredient(ingredient.id)
      .then(() => onRemoveFromInventory(ingredient))
      .catch((error: any) => {
        if (error.response?.status === 409) {
          const count: number = error.response.data.recipeCount
          alert(`Ten składnik jest używany w ${count} ${count === 1 ? 'przepisie' : 'przepisach'}.`)
        } else {
          alert("Wywaliło się :(")
        }
      })
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
    setSelectedRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
  }

  const onSelectRecipeClick = (recipe: Recipe) => {
    const index = selectedRecipes.findIndex(r => r.id === recipe.id)
    if (index > -1) {
      const newSelectedRecipes = [...selectedRecipes]
      newSelectedRecipes.splice(index, 1)
      setSelectedRecipes(newSelectedRecipes)
    } else {
      const mismatches = recipe.quantifiedIngredients.filter(qi => {
        const inv = inventory.get(qi.ingredient.id)
        return inv && !areCompatibleUnits(inv.unit, qi.unit)
      })
      if (mismatches.length > 0) {
        const mismatchText = mismatches
          .map(qi => {
            const inv = inventory.get(qi.ingredient.id)
            return inv ? `${qi.ingredient.name}: inwentarz ${inv.unit}, przepis ${qi.unit}` : null
          })
          .filter(Boolean)
          .join('\n')
        if (!confirm(`Niezgodność jednostek:\n${mismatchText}\n\nDodać przepis mimo to?`)) return
      }
      setSelectedRecipes([...selectedRecipes, recipe])
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
        inventory={inventory}
        projectedInventory={projectedInventory}
        onAddToInventory={onAddToInventory}
        onRemoveFromInventory={onRemoveFromInventory}
        onUpdateInventoryItem={onUpdateInventoryItem}
        onDeleteIngredient={onDeleteIngredient}
        onTogglePerishable={onTogglePerishable}
      />
      <RecipesList
        recipes={filteredRecipes}
        ingredients={chosenIngredientsNames}
        inventoryIngredientNames={new Set(Array.from(inventory.values()).map(item => item.ingredient.name))}
        allTags={allTags}
        selectedTagIds={selectedTagIds}
        selectedRecipeIds={new Set(selectedRecipes.map(r => r.id))}
        recipesWithMismatch={recipesWithMismatch}
        sortStrategy={sortStrategy}
        recipeScores={recipeScores}
        onTagToggle={onTagToggle}
        onSortStrategyChange={(strategy) => {
          if (strategy === "random") {
            setRandomSortKeys(new Map(recipes.map(r => [r.id, Math.random()])))
          }
          setSortStrategy(strategy)
        }}
        onAddToInventory={onAddToInventory}
        onRemoveRecipeClick={onRemoveRecipeClick}
        onSelectRecipeClick={onSelectRecipeClick}
        onRecipeEdited={onRecipeEdited}
      />
      <div className="RightPanel">
        <button className="RightPanel-addRecipeBtn" onClick={() => setShowAddModal(true)}>
          + Dodaj przepis
        </button>
        <AddTag/>
        <Menu categories={sortedCategoriesAndServings}/>
        <ShoppingList deficits={shoppingListDeficits} mismatches={shoppingListMismatches}/>
        {showAddModal && (
          <EditRecipeModal
            allTags={allTags}
            onClose={() => setShowAddModal(false)}
            onSaved={(recipe) => setRecipes(prev => [...prev, recipe])}
          />
        )}
      </div>
    </div>
  )
}

export default App
