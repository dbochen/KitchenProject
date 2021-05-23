package com.example.KitchenProject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class Ingredient {
    private String name;
    private int quantity;
    private QuantityUnit unit;
}
