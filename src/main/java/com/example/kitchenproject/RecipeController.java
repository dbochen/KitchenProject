package com.example.kitchenproject;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;

import static com.example.kitchenproject.config.Config.UI_ORIGIN;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
@Validated
public class RecipeController {

    private final RecipeRepository recipeRepository;

    public RecipeController(@Autowired RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/recipes")
    public List<Recipe> getRecipes(@RequestParam(required = false, defaultValue = "") String sort) {
        return recipeRepository.getAllRecipes(sort);
    }

    @GetMapping("/ingredients")
    public List<Ingredient> getIngredients(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "10") @Valid @Min(1) int limit
    )  {
        return recipeRepository.getAllIngredients(search, limit);
    }
}
