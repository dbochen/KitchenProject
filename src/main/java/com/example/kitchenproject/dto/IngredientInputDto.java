package com.example.kitchenproject.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data

public class IngredientInputDto {
    @NotNull
    @Size(max = 25, min = 1)
    private String name;
}
