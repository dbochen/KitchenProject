package com.example.kitchenproject;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Recipe {
    private String name;
    private List<Ingredient> ingredients;
    private String source;
    private int timeInMinutes;
}
