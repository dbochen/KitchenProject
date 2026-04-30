package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.QuantityUnit;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuantifiedIngredientOutputDto {
    private IngredientOutputDto ingredient;
    private double quantity;
    private QuantityUnit unit;
    private List<IngredientOutputDto> substitutes;
}
