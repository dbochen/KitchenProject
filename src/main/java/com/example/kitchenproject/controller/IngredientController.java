package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.IngredientDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;

import static com.example.kitchenproject.config.Config.UI_ORIGIN;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
@Validated
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(@Autowired IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/ingredients")
    public List<Ingredient> getIngredients(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "10") @Valid @Min(1) int limit
    )  {
        return ingredientService.getAllIngredients(search, limit);
    }

    @PostMapping("/ingredients")
    public Ingredient addIngredient(@Valid @RequestBody IngredientDto ingredientDto){
        return ingredientService.save(ingredientDto);

    }
}
