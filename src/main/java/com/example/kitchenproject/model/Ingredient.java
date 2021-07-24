package com.example.kitchenproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@AllArgsConstructor

@Entity
public class Ingredient {
    @Id
    @GeneratedValue
    private int id;
    private String name;
}
