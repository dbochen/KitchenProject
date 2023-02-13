package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.RecipeInputDto;
import com.example.kitchenproject.dto.RecipeOutputDto;
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
    public List<RecipeOutputDto> getRecipes(
            @RequestParam(required = false, defaultValue = "") String sort,
            @RequestParam(required = false, defaultValue = "") String tags
    ) {
        return recipeService.getAllRecipes(sort, tags);
    }

    @PostMapping("/recipes")
    public Recipe addRecipe (@Valid @RequestBody RecipeInputDto recipeDto){
        return recipeService.save(recipeDto);
    }

    @DeleteMapping("/recipes/{id}")
    public void removeRecipe(@PathVariable Integer id) {
        recipeService.removeRecipe(id);
    }

    @GetMapping("/recipes/{id}")
    public RecipeOutputDto getRecipe(@PathVariable Integer id) {
        return recipeService.getRecipe(id);
    }

    @PutMapping("/recipes/{id}")
    public void addTags(@PathVariable Integer id, @RequestBody List<Integer> tagIds) {
        recipeService.addTagsToRecipe(id, tagIds);
    }
}
