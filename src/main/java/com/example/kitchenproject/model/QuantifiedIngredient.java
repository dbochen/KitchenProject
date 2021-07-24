package com.example.kitchenproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Data
@AllArgsConstructor

@Entity
public class QuantifiedIngredient {

    @Id
    @GeneratedValue
    private int id;
    @ManyToOne
    private Ingredient ingredient;
    private int quantity;
    private QuantityUnit unit;
}
