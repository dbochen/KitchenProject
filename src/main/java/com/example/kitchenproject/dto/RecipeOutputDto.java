package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Category;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class RecipeOutputDto {
    private int id;
    private String name;
    private List<QuantifiedIngredientOutputDto> quantifiedIngredients;
    private String source;
    private List<String> tags;
    private Map<Category, Double> categoryServings;
    private int balanceSum;
    private int inflammationSum;
}
