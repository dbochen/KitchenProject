package com.example.kitchenproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@AllArgsConstructor

@Entity
public class Recipe {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    @OneToMany
    private List<QuantifiedIngredient> quantifiedIngredients;
    private String source;
    private int timeInMinutes;
}
