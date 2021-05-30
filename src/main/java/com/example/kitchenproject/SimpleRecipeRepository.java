package com.example.kitchenproject;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantityUnit;
import com.example.kitchenproject.model.Recipe;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Repository
public class SimpleRecipeRepository implements RecipeRepository {

    private static final List<Recipe> RECIPES = Arrays.asList(
            new Recipe(
                    "parówki",
                    List.of(new Ingredient("parówka", 4, QuantityUnit.GRAM)),
                    "domowy",
                    10
            ),
            new Recipe(
                    "tosty",
                    List.of(
                            new Ingredient("chleb tostowy", 2, QuantityUnit.CUP),
                            new Ingredient("szynka", 1, QuantityUnit.LITER),
                            new Ingredient("ser", 1, QuantityUnit.TEA_SPOON)
                    ),
                    "domowy",
                    5
            ),
            new Recipe(
                    "chrupki z mlekiem",
                    List.of(
                            new Ingredient("chrupki", 100, QuantityUnit.GRAM),
                            new Ingredient("mleko", 300, QuantityUnit.MILLILITER)
                    ),
                    "starożytny",
                    15
            )
    );

    @Override
    public List<Recipe> getAllRecipes() {
        return RECIPES;
    }

    @Override
    public List<String> getIngredientsNames(String search, int limit) {
        return RECIPES.stream()
                .map(Recipe::getIngredients)
                .flatMap(Collection::stream)
                .map(Ingredient::getName)
                .distinct()
                .filter(name -> name.startsWith(search))
                .limit(limit)
                .collect(toList());
    }
}
