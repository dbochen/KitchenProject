package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.RecipeDto;
import com.example.kitchenproject.model.Recipe;
import com.example.kitchenproject.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static com.example.kitchenproject.config.Config.UI_ORIGIN;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
@Validated
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(@Autowired RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/recipes")
    public List<Recipe> getRecipes(@RequestParam(required = false, defaultValue = "") String sort) {
        return recipeService.getAllRecipes(sort);
    }

    @PostMapping("/recipes")
    public Recipe addRecipe (@Valid @RequestBody RecipeDto recipeDto){
        return recipeService.save(recipeDto);
    }


}
