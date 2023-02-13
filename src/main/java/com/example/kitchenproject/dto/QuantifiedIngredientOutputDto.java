package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.QuantityUnit;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuantifiedIngredientOutputDto {
    private IngredientOutputDto ingredient;
    private double quantity;
    private QuantityUnit unit;
}
