package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.IngredientOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true)
    private String name;
    @Column
    private Category category;
    @OneToMany
    @JoinColumn(name = "ingredient_id")
    private List<Serving> servings;

    public IngredientOutputDto toOutputDto(QuantityUnit unit) {
        return IngredientOutputDto.builder()
                .serving(servings
                        .stream()
                        .filter(serving -> serving.getUnit().equals(unit))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException(
                                String.format("Cannot find serving size for the " +
                                        "ingredient %d with category %s and unit %s", id, category, unit)))
                        .getCategoryServing()
                )
                .build();
    }
}
