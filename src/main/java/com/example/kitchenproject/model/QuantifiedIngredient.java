package com.example.kitchenproject.model;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    @ManyToOne
    private Ingredient ingredient;
    private int quantity;
    private QuantityUnit unit;
}
