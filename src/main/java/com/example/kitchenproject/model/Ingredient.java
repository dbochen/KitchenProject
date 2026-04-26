package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.IngredientOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
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
    @Column
    private Balance vataBalance;
    @Column
    private Inflammation inflammation;

    public IngredientOutputDto toOutputDto() {
        return IngredientOutputDto.builder()
                .id(id)
                .name(name)
                .vataBalance(vataBalance)
                .inflammation(inflammation)
                .build();
    }
}
