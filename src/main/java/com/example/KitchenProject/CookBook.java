package com.example.KitchenProject;

import java.util.List;

public class CookBook {
    private List<Recipe> recipes;

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void addRecipe (Recipe newRecipe){
        recipes.add(newRecipe);
    }
}
