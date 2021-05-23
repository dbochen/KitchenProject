package com.example.KitchenProject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class Recipe {
    private String name;
    private List<Ingredient> ingredients;
    private String source;
    private int time;
    private CookingLevel level;


}
