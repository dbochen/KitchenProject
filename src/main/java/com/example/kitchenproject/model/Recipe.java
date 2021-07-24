package com.example.kitchenproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Recipe {
    private String name;
    private List<QuantifiedIngredient> quantifiedIngredients;
    private String source;
    private int timeInMinutes;
}
