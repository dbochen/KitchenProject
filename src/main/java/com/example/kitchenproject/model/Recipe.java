package com.example.kitchenproject.model;

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
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    private String name;
    @OneToMany(cascade= CascadeType.ALL)
    private List<QuantifiedIngredient> quantifiedIngredients;
    private String source;
    private int timeInMinutes;
}
