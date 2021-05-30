package com.example.kitchenproject;

import com.example.kitchenproject.model.Recipe;

import java.util.List;

public interface RecipeRepository {
    List<Recipe> getAllRecipes();

    List<String> getIngredientsNames(String search, int limit);
}
