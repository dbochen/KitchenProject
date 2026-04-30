package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.QuantityUnit;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class QuantifiedIngredientInputDto {
    @NotNull
    private int id;
    private double quantity;
    private QuantityUnit unit;
    private List<Integer> substituteIds;

    public QuantifiedIngredient toQuantifiedIngredient() {
        return QuantifiedIngredient.builder()
                .ingredient(Ingredient.builder().id(id).build())
                .quantity(quantity)
                .unit(unit)
                .substitutes(substituteIds != null ? substituteIds.stream()
                        .map(sid -> Ingredient.builder().id(sid).build())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }
}
