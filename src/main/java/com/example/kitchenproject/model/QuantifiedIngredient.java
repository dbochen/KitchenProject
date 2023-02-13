package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.QuantifiedIngredientOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class QuantifiedIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private Ingredient ingredient;
    private double quantity;
    private QuantityUnit unit;

    public QuantifiedIngredientOutputDto toOutputDto() {
        return QuantifiedIngredientOutputDto.builder()
                .unit(unit)
                .ingredient(ingredient.toOutputDto(unit))
                .build();
    }
}
