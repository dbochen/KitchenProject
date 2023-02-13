package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Category;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Builder
public class IngredientOutputDto {
    private int id;
    private String name;
    private Category category;
    private double serving;
}
