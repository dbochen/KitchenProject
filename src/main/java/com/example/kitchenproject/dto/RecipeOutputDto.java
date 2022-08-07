package com.example.kitchenproject.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecipeOutputDto {
    private String name;
    private List<String> tags;
}
