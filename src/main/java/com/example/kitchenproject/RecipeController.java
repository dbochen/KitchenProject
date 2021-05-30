package com.example.kitchenproject;

import com.example.kitchenproject.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.example.KitchenProject.config.Config.UI_ORIGIN;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
public class RecipeController {

    private final RecipeRepository recipeRepository;

    public RecipeController(@Autowired RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/recipes")
    public List<Recipe> getRecipes() {
        return recipeRepository.getAllRecipes();
    }

    @GetMapping("/ingredients")
    public List<String> getIngredients() {
        return recipeRepository.getAllIngredientNames();
    }
}
