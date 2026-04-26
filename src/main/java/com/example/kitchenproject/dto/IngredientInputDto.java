package com.example.kitchenproject.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data

public class IngredientInputDto {
    @NotNull
    @Size(max = 25, min = 1)
    private String name;
}
