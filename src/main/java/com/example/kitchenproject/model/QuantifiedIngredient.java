package com.example.kitchenproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuantifiedIngredient {
    private Ingredient ingredient;
    private int quantity;
    private QuantityUnit unit;
}
