package com.example.kitchenproject;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Ingredient {
    private String name;
    private int quantity;
    private QuantityUnit unit;
}
