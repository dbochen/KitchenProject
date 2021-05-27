package com.example.kitchenproject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class RecipeController {
    List<Recipe> recipes = Arrays.asList(
            new Recipe(
                    "parówki",
                    Arrays.asList(new Ingredient("parówka", 4, QuantityUnit.GRAM)),
                    "domowy",
                    10
            ),
            new Recipe(
                    "tosty",
                    Arrays.asList(
                            new Ingredient("chleb tostowy", 2, QuantityUnit.CUP),
                            new Ingredient("szynka", 1, QuantityUnit.LITER),
                            new Ingredient("ser", 1, QuantityUnit.TEA_SPOON)
                    ),
                    "domowy",
                    5
            ),
            new Recipe(
                    "chrupki z mlekiem",
                    Arrays.asList(
                            new Ingredient("chrupki", 100, QuantityUnit.GRAM),
                            new Ingredient("mleko", 300, QuantityUnit.MILLILITER)
                    ),
                    "starożytny",
                    15
            )
    );

    @GetMapping("/recipe")
    public List<Recipe> getRecipes() {
        return recipes;
    }
}
