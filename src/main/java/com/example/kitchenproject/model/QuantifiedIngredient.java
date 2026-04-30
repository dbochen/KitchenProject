package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.QuantifiedIngredientOutputDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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
    @Enumerated(EnumType.STRING)
    private QuantityUnit unit;
    @ManyToMany
    @JoinTable(
            name = "quantified_ingredient_substitutes",
            joinColumns = @JoinColumn(name = "quantified_ingredient_id"),
            inverseJoinColumns = @JoinColumn(name = "substitute_id")
    )
    @Builder.Default
    private List<Ingredient> substitutes = new ArrayList<>();

    public QuantifiedIngredientOutputDto toOutputDto() {
        return QuantifiedIngredientOutputDto.builder()
                .unit(unit)
                .ingredient(ingredient.toOutputDto())
                .quantity(quantity)
                .substitutes(substitutes.stream().map(Ingredient::toOutputDto).collect(Collectors.toList()))
                .build();
    }
}
