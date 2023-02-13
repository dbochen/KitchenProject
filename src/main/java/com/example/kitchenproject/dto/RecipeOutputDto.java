package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Tag;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecipeOutputDto {
    private int id;
    private String name;
    private List<QuantifiedIngredientOutputDto> quantifiedIngredients;
    private String source;
    private List<String> tags;
}
