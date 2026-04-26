package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Balance;
import com.example.kitchenproject.model.Inflammation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IngredientOutputDto {
    private int id;
    private String name;
    private Balance vataBalance;
    private Inflammation inflammation;
}
