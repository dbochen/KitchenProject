package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.QuantityUnit;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class QuantifiedIngredientInputDto {
    @NotNull
    private int id;
    private double quantity;
    private QuantityUnit unit;

    public QuantifiedIngredient toQuantifiedIngredient() {
        return QuantifiedIngredient.builder()
                .ingredient(Ingredient.builder().id(id).build())
                .quantity(quantity)
                .unit(unit)
                .build();
    }
}
