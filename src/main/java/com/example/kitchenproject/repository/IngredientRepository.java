package com.example.kitchenproject.repository;

import com.example.kitchenproject.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {

    @Query("SELECT COUNT(qi) FROM QuantifiedIngredient qi WHERE qi.ingredient.id = :id")
    long countUsages(@Param("id") int id);
}
