package com.example.kitchenproject;


import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.QuantityUnit;
import com.example.kitchenproject.model.Recipe;
import com.example.kitchenproject.repository.RecipeRepository;
import com.example.kitchenproject.service.RecipeService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static java.util.List.of;

public class RecipeServiceTest {
    private static final List<Recipe> RECIPES = Arrays.asList(
            new Recipe(
                    1,
                    "parówki",
                    of(new QuantifiedIngredient(1, new Ingredient(1, "parówka"), 4, QuantityUnit.GRAM)),
                    "domowy",
                    10,
                    of()
            ),
            new Recipe(
                    2,
                    "tosty",
                    of(
                            new QuantifiedIngredient(2, new Ingredient(2, "chleb tostowy"), 2, QuantityUnit.CUP),
                            new QuantifiedIngredient(3, new Ingredient(3, "szynka"), 1, QuantityUnit.LITER),
                            new QuantifiedIngredient(4, new Ingredient(4, "ser"), 1, QuantityUnit.TEA_SPOON)
                    ),
                    "domowy",
                    5,
                    of()
            ),
            new Recipe(
                    3,
                    "chrupki z mlekiem",
                    of(
                            new QuantifiedIngredient(5, new Ingredient(100, "chrupki"), 100, QuantityUnit.GRAM),
                            new QuantifiedIngredient(6, new Ingredient(300, "mleko"), 300, QuantityUnit.MILLILITER),
                            new QuantifiedIngredient(7, new Ingredient(1, "parówka"), 8, QuantityUnit.GRAM)
                    ),
                    "starożytny",
                    15,
                    of()
            )
    );

    @Test
    public void shouldReturnSortedRecipes() {

        RecipeRepository repository = Mockito.mock(RecipeRepository.class);
        RecipeService recipeService = new RecipeService(repository);

        Mockito.when(repository.findAll()).thenReturn(RECIPES);

        List<Recipe> result = recipeService.getAllRecipes("1");

        Assertions.assertEquals("parówki", result.get(0).getName());
        Assertions.assertEquals("chrupki z mlekiem", result.get(1).getName());
        Assertions.assertEquals("tosty", result.get(2).getName());
    }

    @Test
    public void shouldReturnSortedRecipesFromTwoIngredients() {
        RecipeRepository repository = Mockito.mock(RecipeRepository.class);
        RecipeService recipeService = new RecipeService(repository);

        Mockito.when(repository.findAll()).thenReturn(RECIPES);

        List<Recipe> result = recipeService.getAllRecipes("1,3");

        Assertions.assertEquals("parówki", result.get(0).getName());
        Assertions.assertEquals("tosty", result.get(1).getName());
        Assertions.assertEquals("chrupki z mlekiem", result.get(2).getName());

    }
}
