package com.example.kitchenproject;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static com.example.KitchenProject.config.Config.UI_ORIGIN;
import static java.util.stream.Collectors.toList;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
public class RecipeController {
    private static final List<Recipe> recipes = Arrays.asList(
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

    @GetMapping("/recipes")
    public List<Recipe> getRecipes() {
        return recipes;
    }

    @GetMapping("/ingredients")
    public List<String> getIngredients() {
        return recipes.stream()
                .map(Recipe::getIngredients)
                .flatMap(Collection::stream)
                .map(Ingredient::getName)
                .distinct()
                .collect(toList());
    }
}
