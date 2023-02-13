package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Category;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IngredientOutputDto {
    private int id;
    private String name;
}
