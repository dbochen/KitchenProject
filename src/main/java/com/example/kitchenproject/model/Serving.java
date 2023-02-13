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
public class Serving {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private QuantityUnit unit;
    private double categoryServing;
}
