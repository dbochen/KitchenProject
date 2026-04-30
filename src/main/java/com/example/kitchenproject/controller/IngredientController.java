package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.IngredientInputDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;

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
    public Ingredient addIngredient(@Valid @RequestBody IngredientInputDto ingredientDto){
        return ingredientService.save(ingredientDto);
    }

    @DeleteMapping("/ingredients/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIngredient(@PathVariable int id) {
        ingredientService.delete(id);
    }
}
