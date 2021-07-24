package com.example.kitchenproject;


import com.example.kitchenproject.model.Recipe;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

public class SimpleRecipeRepositoryTest {


    @Test
    public void shouldReturnSortedRecipes (){

        RecipeRepository recipeRepository = new SimpleRecipeRepository();
        List<Recipe> result =recipeRepository.getAllRecipes("1");

        Assertions.assertEquals("parówki",result.get(0).getName());
        Assertions.assertEquals("chrupki z mlekiem",result.get(1).getName());
        Assertions.assertEquals("tosty",result.get(2).getName());


    }

    @Test
    public void shouldReturnSortedRecipesFromTwoIngredients (){

        RecipeRepository recipeRepository = new SimpleRecipeRepository();
        List<Recipe> result =recipeRepository.getAllRecipes("1,3");

        Assertions.assertEquals("parówki",result.get(0).getName());
        Assertions.assertEquals("tosty",result.get(1).getName());
        Assertions.assertEquals("chrupki z mlekiem",result.get(2).getName());


    }
}
