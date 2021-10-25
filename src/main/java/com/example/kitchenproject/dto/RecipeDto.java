package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Recipe;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class RecipeDto {
    @Size(min = 1, max = 100)
    @NotNull
    private String name;
    @NotEmpty(message = "Recipe without ingredients?!")
    private List<QuantifiedIngredientDto> ingredients;
    private String source;


    public Recipe toRecipe() {
        return Recipe.builder()
                .name(name)
                .quantifiedIngredients(ingredients.stream()
                        .map(QuantifiedIngredientDto::toQuantifiedIngredient)
                        .collect(Collectors.toList()))
                .source(source)
                .build();

    }


}
