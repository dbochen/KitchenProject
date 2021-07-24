package com.example.kitchenproject;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.QuantityUnit;
import com.example.kitchenproject.model.Recipe;
import org.springframework.stereotype.Repository;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Repository
public class SimpleRecipeRepository implements RecipeRepository {

    private static final List<Recipe> RECIPES = Arrays.asList(
            new Recipe(
                    "parówki",
                    List.of(new QuantifiedIngredient(new Ingredient("parówka", 1), 4, QuantityUnit.GRAM)),
                    "domowy",
                    10
            ),
            new Recipe(
                    "tosty",
                    List.of(
                            new QuantifiedIngredient(new Ingredient("chleb tostowy", 2), 2, QuantityUnit.CUP),
                            new QuantifiedIngredient(new Ingredient("szynka", 3), 1, QuantityUnit.LITER),
                            new QuantifiedIngredient(new Ingredient("ser", 4), 1, QuantityUnit.TEA_SPOON)
                    ),
                    "domowy",
                    5
            ),
            new Recipe(
                    "chrupki z mlekiem",
                    List.of(
                            new QuantifiedIngredient(new Ingredient("chrupki", 100), 100, QuantityUnit.GRAM),
                            new QuantifiedIngredient(new Ingredient("mleko", 300), 300, QuantityUnit.MILLILITER),
                            new QuantifiedIngredient(new Ingredient("parówka", 1), 8, QuantityUnit.GRAM)
                    ),
                    "starożytny",
                    15
            )
    );

    @Override
    public List<Recipe> getAllRecipes(String sort) {
        List<Integer> ids = Arrays.stream(sort.split(","))
                .map(Integer::parseInt)
                .collect(toList());

        Map<Recipe, Double> result = new HashMap<>();

        for (Recipe recipe : RECIPES) {
            List<Integer> ingredientsFromRecipes = recipe.getQuantifiedIngredients()
                    .stream()
                    .map(QuantifiedIngredient::getIngredient)
                    .map(Ingredient::getId)
                    .collect(toList());
            double appearanceCount = 0;

            for (Integer id : ids) {
                if (ingredientsFromRecipes.contains(id)) {
                    appearanceCount++;
                }
            }

            result.put(recipe, appearanceCount / ingredientsFromRecipes.size());

        }

        List<Map.Entry<Recipe, Double>> entries = new ArrayList<>(result.entrySet());

        return entries.stream()
                .sorted(Comparator.comparingDouble(entry -> -entry.getValue()))
                .map(Map.Entry::getKey)
                .collect(toList());
    }

    @Override
    public List<Ingredient> getAllIngredients(String search, int limit) {
        return RECIPES.stream()
                .map(Recipe::getQuantifiedIngredients)
                .flatMap(Collection::stream)
                .map(QuantifiedIngredient::getIngredient)
                .distinct()
                .filter(ingredient -> ingredient.getName().startsWith(search))
                .limit(limit)
                .collect(toList());
    }
}
