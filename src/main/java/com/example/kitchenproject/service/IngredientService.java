package com.example.kitchenproject.service;

import com.example.kitchenproject.dto.IngredientDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;


    public IngredientService(@Autowired IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }
    public List<Ingredient> getAllIngredients(String search, int limit) {

       return ingredientRepository.findAll().stream()
               .filter(ingredient -> ingredient.getName().startsWith(search))
                .limit(limit)
                .collect(toList());
    }

    public Ingredient save(IngredientDto ingredientDto) {
       return ingredientRepository.save(Ingredient.builder().name(ingredientDto.getName()).build());
    }
}
