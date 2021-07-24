package com.example.kitchenproject;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.Recipe;

import java.util.List;


public interface RecipeRepository {
    List<Recipe> getAllRecipes(String sort);

    List<Ingredient> getAllIngredients(String search, int limit);
}
