package com.example.kitchenproject;

import com.example.kitchenproject.model.Recipe;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SimpleRecipeRepositoryTest {

    @Test
    public void shouldReturnSortedRecipes() {
        RecipeRepository recipeRepository = new SimpleRecipeRepository();

        List<Recipe> result = recipeRepository.getAllRecipes("1");

        assertEquals("parówki", result.get(0).getName());
        assertEquals("chrupki z mlekiem", result.get(1).getName());
        assertEquals("tosty", result.get(2).getName());
    }

    @Test
    public void shouldReturnSortedRecipesFromTwoIngredients() {
        RecipeRepository recipeRepository = new SimpleRecipeRepository();

        List<Recipe> result = recipeRepository.getAllRecipes("1,3");

        assertEquals("parówki", result.get(0).getName());
        assertEquals("tosty", result.get(1).getName());
        assertEquals("chrupki z mlekiem", result.get(2).getName());
    }

    @Test
    public void shouldReturnListWithArbitraryOrderWhenSortStringIsEmpty() {
        RecipeRepository recipeRepository = new SimpleRecipeRepository();

        List<Recipe> result = recipeRepository.getAllRecipes("");

        assertEquals(3, result.size());
    }
}
