package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Recipe;
import lombok.Data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class RecipeInputDto {
    @Size(min = 1, max = 100)
    @NotNull
    private String name;
    @NotEmpty(message = "Recipe without ingredients?!")
    private List<QuantifiedIngredientInputDto> ingredients;
    private String source;
    private List<Integer> tagIds;

    public Recipe toRecipe() {
        return Recipe.builder()
                .name(name)
                .quantifiedIngredients(ingredients.stream()
                        .map(QuantifiedIngredientInputDto::toQuantifiedIngredient)
                        .collect(Collectors.toList()))
                .source(source)
                .build();
    }
}
